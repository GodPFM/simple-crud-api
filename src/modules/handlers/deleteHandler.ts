import { EventEmmit } from '../../types/types';
import { validate } from 'uuid';
import { deleteUser, getUserById } from '../../utils/utils';

export const deleteHandler = async (args: EventEmmit) => {
  const { res, url } = args;
  const splitURL = url.split('/').filter((item) => item);
  const id = splitURL.at(-1);
  if (splitURL.length === 3 && id) {
    const isValidId = validate(id);
    if (isValidId) {
      const getUser = getUserById(id);
      if (getUser) {
        deleteUser(id);
        res.writeHead(204, { 'Content-Type': 'application/json' });
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify('User not found'));
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
