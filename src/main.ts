import Server from './modules/server/server';
import { Users } from './database/database';
import 'dotenv/config';
import os from 'os';
import cluster from 'cluster';
import http from 'http';
import * as process from 'process';

const PORT = process.env.PORT || 5000;
export const database = new Users();
const isMultiMode = process.argv.includes('--multi');
const numWorkers = os.cpus().length;

if (isMultiMode) {
  if (cluster.isPrimary) {
    for (let i = 1; i <= numWorkers; i++) {
      cluster.fork({ WORKER_PORT: Number(PORT) + i });
    }
    cluster.on('exit', (worker) => {
      console.log(`Worker ${worker.id} is dead. Lets turn on next`);
    });
    let currentWorker = 1;
    const balancer = http.createServer(async (req, res) => {
      try {
        let JSONString = '';
        await new Promise((resolve) => {
          req
            .on('data', (chunk) => {
              JSONString += chunk.toString();
            })
            .on('end', () => {
              resolve(true);
            });
        });

        const request = http.request(
          {
            path: req.url,
            method: req.method,
            port: Number(PORT) + currentWorker,
            headers: {
              'Content-Type': 'application/json',
            },
          },
          async (responseFromRequest) => {
            const operationCode = responseFromRequest.statusCode;
            let data = '';
            await new Promise((resolve) => {
              responseFromRequest
                .on('data', (chunk) => {
                  data += chunk.toString();
                })
                .on('end', () => {
                  resolve(true);
                });
            });
            res.writeHead(operationCode ? operationCode : 500, {
              'Content-Type': 'application/json',
            });
            res.write(data);
            res.end();
          },
        );

        request.on('error', (err) => {
          console.log(`Something went wrong with cluster - ${err}`);
        });
        request.write(JSONString);
        request.end();
        currentWorker = currentWorker + 1 > numWorkers ? currentWorker + 1 : 1;
      } catch {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify('Invalid request'));
        res.end();
      }
    });
    balancer.listen(PORT, () => {
      console.log(`Main cluster open on ${PORT} port`);
    });
  } else {
    const workerPort = process.env.WORKER_PORT ?? 5000;
    console.log(`Worker ${cluster.worker?.id} is listening PORT ${workerPort}`);
    const server = new Server(workerPort);
  }
} else {
  const server = new Server(PORT);
}
