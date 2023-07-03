import { EventEmmit, IUser } from '../../types/types';
import { validate } from 'uuid';
import {
  checkMessage,
  getUserById,
  parseMessage,
  updateUser,
} from '../../utils/utils';

export const putHandler = async (args: EventEmmit) => {
  const { req, res, url } = args;
  const splitURL = url.split('/').filter((item) => item);
  const parsedMessage = await parseMessage(req);
  const resultCheckOfMessage = checkMessage(parsedMessage);
  const id = splitURL.at(-1);
  if (splitURL.length === 3 && id) {
    const isValidId = validate(id);
    if (isValidId) {
      if (parsedMessage && resultCheckOfMessage) {
        const user = getUserById(id);
        if (user) {
          updateUser(id, parsedMessage as Omit<IUser, 'id'>);
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.write(JSON.stringify('User updated'));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.write(JSON.stringify(`User with id ${id} does not exists`));
        }
      } else {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify('Invalid request'));
      }
    } else {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify('Invalid id'));
    }
  } else {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify('Invalid request'));
  }
  res.end();
};
