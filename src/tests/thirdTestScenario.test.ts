import { describe } from 'node:test';
import process from 'process';
import request from 'supertest';
import { IUser } from '../types/types';

const userData: Omit<IUser, 'id'> = {
  username: 'Testing',
  age: 25,
  hobbies: ['Testing'],
};

const idToDelete: Array<string | null> = [];

const port = process.env.PORT || 4000;

describe('Test for simple CRUD API', () => {
  test('Add first user', async () => {
    const newUserData: Omit<IUser, 'id'> = { ...userData, age: 30 };
    const response = await request(`localhost:${port}`)
      .post('/api/users')
      .send(newUserData);
    expect(response.statusCode).toBe(201);
    idToDelete.push(JSON.parse(response.text).id);
  });
  test('Add second user', async () => {
    const newUserData: Omit<IUser, 'id'> = { ...userData, age: 32 };
    const response = await request(`localhost:${port}`)
      .post('/api/users')
      .send(newUserData);
    expect(response.statusCode).toBe(201);
    idToDelete.push(JSON.parse(response.text).id);
  });
  test('Add third user', async () => {
    const newUserData: Omit<IUser, 'id'> = { ...userData, age: 35 };
    const response = await request(`localhost:${port}`)
      .post('/api/users')
      .send(newUserData);
    expect(response.statusCode).toBe(201);
  });
  test('Check exists users', async () => {
    const response = await request(`localhost:${port}`).get('/api/users');
    expect(response.statusCode).toBe(200);
    expect(response.body.data.length).toEqual(4);
  });
  test('Delete two of then', async () => {
    for (const value of idToDelete) {
      const response = await request(`localhost:${port}`).delete(
        `/api/users/${value}`,
      );
      expect(response.statusCode).toEqual(204);
    }
    const response = await request(`localhost:${port}`).get('/api/users');
    expect(response.statusCode).toBe(200);
    expect(response.body.data.length).toEqual(2);
  });
});
