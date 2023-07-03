import { IUser } from '../types/types';

export class Users {
  private users: IUser[];
  constructor() {
    this.users = [
      {
        id: '6966c226-89f8-4ede-9064-afc2a6f7c587',
        username: 'test',
        age: 20,
        hobbies: ['plant', 'swim'],
      },
    ];
  }

  getUsers() {
    return this.users;
  }

  addUser(newUser: IUser) {
    this.users.push(newUser);
  }

  updateUsers(newData: IUser[]) {
    this.users = newData;
    console.log(this.users);
  }
}
