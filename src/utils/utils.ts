import http from 'http';
import { IUser } from '../types/types';
import { database } from '../main';

export const isValidRequest = (method?: string, url?: string): boolean => {
  if (method && url) {
    if (url.includes('api/users')) {
      return true;
    }
  }
  return false;
};

export const getUserById = (uuid: string) => {
  const users = database.getUsers();
  return users.find((user) => user.id === uuid);
};

export const parseMessage = async (req: http.IncomingMessage) => {
  let JSONString = '';
  return new Promise((resolve) => {
    req
      .on('data', (chunk) => {
        JSONString += chunk;
      })
      .on('end', () => {
        try {
          const parsedData = JSON.parse(JSONString);
          resolve(parsedData);
        } catch {
          resolve(null);
        }
      });
  });
};

export const checkMessage = (message?: unknown) => {
  if (message && typeof message === 'object') {
    if ('username' in message && typeof message.username === 'string') {
      if ('age' in message && typeof message.age === 'number') {
        if ('hobbies' in message && Array.isArray(message.hobbies)) {
          for (const item of message.hobbies) {
            console.log(item);
            if (typeof item !== 'string') {
              return false;
            }
          }
          return true;
        }
      }
    }
  }
  return false;
};

export const updateUser = (id: string, newData: Omit<IUser, 'id'>) => {
  const users = database.getUsers();
  const newUsers = users.reduce((acc, user) => {
    if (user.id !== id) {
      acc.push(user);
    } else {
      acc.push({ id, ...newData });
    }
    return acc;
  }, [] as IUser[]);
  database.updateUsers(newUsers);
};

export const deleteUser = (id: string) => {
  const users = database.getUsers();
  const updatedList = users.reduce((acc, user) => {
    if (user.id !== id) {
      acc.push(user);
    }
    return acc;
  }, [] as IUser[]);
  database.updateUsers(updatedList);
};
