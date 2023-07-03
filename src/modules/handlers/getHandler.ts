import { EventEmmit } from '../../types/types';
import { users } from '../../database/database';
import { validate } from 'uuid';
import { getUserById } from '../../utils/utils';

export const getHandler = (args: EventEmmit) => {
  const { res, url } = args;
  const splitURL = url.split('/').filter((item) => item);
  const id = splitURL.at(-1);
  if (splitURL.length === 2 && url === '/api/users') {
    console.log('data sold');
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
  }
  res.end();
};
