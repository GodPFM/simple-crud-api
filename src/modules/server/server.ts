import http from 'http';
import { isValidRequest } from '../../utils/utils';
import { getHandler } from '../handlers/getHandler';
import { postHandler } from '../handlers/postHandler';
import { putHandler } from '../handlers/putHandler';
import { deleteHandler } from '../handlers/deleteHandler';

type ServerEvents = 'GET' | 'PUT' | 'POST' | 'DELETE';
export type ServerInstance = InstanceType<typeof Server>;

export default class Server {
  private PORT: string | 5000;
  private server: http.Server<
    typeof http.IncomingMessage,
    typeof http.ServerResponse
  > | null;
  constructor(port: string | 5000) {
    this.PORT = port || 5000;
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
          case 'PUT':
            await putHandler({ req, res, url: requestURL });
            break;
          case 'DELETE':
            await deleteHandler({ req, res, url: requestURL });
            break;
          default:
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify('Method is not ready'));
            res.end();
            break;
        }
      } else {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify('Attempt to access a non-existent resource'));
        res.end();
      }
    });

    this.server.listen(this.PORT, () =>
      console.log(`Server started on ${this.PORT}`),
    );
  }
}
