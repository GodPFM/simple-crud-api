import Server from './modules/server/server';
import { Users } from './database/database';

export const database = new Users();
const server = new Server();

console.log(server, database);
