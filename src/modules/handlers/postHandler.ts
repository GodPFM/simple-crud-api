import { EventEmmit, IUser } from '../../types/types';
import { checkMessage, parseMessage } from '../../utils/utils';
import { v4 } from 'uuid';
import { database } from '../../main';

export const postHandler = async (args: EventEmmit) => {
  const { req, res, url } = args;
  const parsedMessage = await parseMessage(req);
  const resultCheckOfMessage = checkMessage(parsedMessage);
  const splitURL = url.split('/').filter((item) => item);
  if (url.includes('/api/users') && splitURL.length === 2) {
    if (parsedMessage === null || !resultCheckOfMessage) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify('Invalid JSON'));
    } else {
      const uuid = v4();
      const newUser = {
        id: uuid,
        ...parsedMessage,
      };
      database.addUser(newUser as IUser);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify(parsedMessage));
    }
  } else {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.write(
      JSON.stringify(
        'Invalid request or attempt to access a non-existent resource',
      ),
    );
  }
  res.end();
};
