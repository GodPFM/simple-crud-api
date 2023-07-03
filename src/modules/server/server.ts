import http from 'http';
import 'dotenv/config';
import { isValidRequest } from '../../utils/utils';
import { EventEmitter } from 'node:events';
import { EventEmmit } from '../../types/types';
import { getHandler } from '../handlers/getHandler';
import { postHandler } from '../handlers/postHandler';

type ServerEvents = 'GET' | 'PUT' | 'POST' | 'DELETE';
export type ServerInstance = InstanceType<typeof Server>;

export default class Server extends EventEmitter {
  private PORT: string | 5000;
  private server: http.Server<
    typeof http.IncomingMessage,
    typeof http.ServerResponse
  > | null;
  constructor() {
    super();
    this.PORT = process.env.PORT || 5000;
    this.server = null;
    this.createServer();
  }

  createServer() {
    this.server = http.createServer(async (req, res) => {
      const requestMethod = req.method;
      const requestURL = req.url;
      const validateRequest = isValidRequest(requestMethod, requestURL);
      if (validateRequest && requestURL) {
        switch (requestMethod) {
          case 'GET':
            getHandler({ req, res, url: requestURL });
            break;
          case 'POST':
            await postHandler({ req, res, url: requestURL });
            break;
        }
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify('Invalid request'));
        res.end();
      }
    });

    this.server.listen(this.PORT, () =>
      console.log(`Server started on ${this.PORT}`),
    );
  }

  on<T>(event: ServerEvents, callback: (arg: T) => void) {
    return super.on(event, callback);
  }

  emit(event: ServerEvents, arg: EventEmmit) {
    return super.emit(event, arg);
  }
}
