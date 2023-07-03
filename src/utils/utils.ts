import { users } from '../database/database';

export const isValidRequest = (method?: string, url?: string): boolean => {
  if (method && url) {
    if (url.includes('api/users')) {
      return true;
    }
  }
  return false;
};

export const getUserById = (uuid: string) => {
  return users.find((user) => user.id === uuid);
};
