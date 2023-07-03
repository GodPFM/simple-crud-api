import http from 'http';

export interface IUsers {
  id: string;
  username: string;
  age: number;
  hobbies: Array<string>;
}

export type EventEmmit = {
  req: http.IncomingMessage;
  res: http.ServerResponse;
  url: string;
};
