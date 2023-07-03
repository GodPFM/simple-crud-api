import { describe } from 'node:test';
import process from 'process';
import request from 'supertest';
import { IUser } from '../types/types';

const port = process.env.PORT || 4000;

describe('Test for simple CRUD API: wrongs urls', () => {
  test('Should throw 404, if wrong api address', async () => {
    const response = await request(`localhost:${port}`).get('/a/users');
    expect(response.statusCode).toBe(404);
  });
  test('Should throw 400, if wrong uuid', async () => {
    const response = await request(`localhost:${port}`).get('/api/users/aabb');
    expect(response.statusCode).toBe(400);
  });
  test('Should throw 404 if user doesnt exist', async () => {
    const response = await request(`localhost:${port}`).get(
      '/api/users/6966c226-89f8-4ede-9064-afc2a6f7c666',
    );
    expect(response.statusCode).toBe(404);
  });
  test('Should throw 400 if request body does not contain required fields', async () => {
    const userData: Omit<IUser, 'id' | 'age'> = {
      username: 'Testing',
      hobbies: ['Testing'],
    };
    const response = await request(`localhost:${port}`)
      .post('/api/users')
      .send(userData);
    expect(response.statusCode).toBe(400);
  });
  test('Put should throw 404 on non exists userid', async () => {
    const userData: Omit<IUser, 'id'> = {
      username: 'Testing',
      age: 25,
      hobbies: ['Testing', 'Testing-2'],
    };
    const response = await request(`localhost:${port}`)
      .put(`/api/users/6966c226-89f8-4ede-9064-afc2a6f7c666`)
      .send(userData);
    expect(response.statusCode).toBe(404);
  });
  test('Delete should throw 404 on non exists userid', async () => {
    const response = await request(`localhost:${port}`).delete(
      `/api/users/6966c226-89f8-4ede-9064-afc2a6f7c666`,
    );
    expect(response.statusCode).toEqual(404);
  });
});
