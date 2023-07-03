import { EventEmmit } from '../../types/types';
import { validate } from 'uuid';
import { getUserById } from '../../utils/utils';
import { database } from '../../main';

export const getHandler = (args: EventEmmit) => {
  const { res, url } = args;
  const splitURL = url.split('/').filter((item) => item);
  const id = splitURL.at(-1);
  if (splitURL.length === 2 && url.includes('/api/users')) {
    const users = database.getUsers();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(
      JSON.stringify({
        data: users,
      }),
    );
  } else if (splitURL.length === 3) {
    if (id) {
      const isUuid = validate(id);
      if (isUuid) {
        const user = getUserById(id);
        if (user !== undefined) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.write(
            JSON.stringify({
              data: user,
            }),
          );
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.write(JSON.stringify('Cant find user with that id'));
        }
      } else {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify('Invalid id'));
      }
    }
  } else {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify('Invalid request'));
  }
  res.end();
};
