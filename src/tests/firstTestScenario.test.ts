import { describe } from 'node:test';
import request from 'supertest';
import 'dotenv/config';
import process from 'process';
import { usersExample } from '../utils/testUtils';
import { IUser } from '../types/types';

const port = process.env.PORT || 4000;
let newUserId: null | string = null;

describe('Test for simple CRUD API', () => {
  test('Get users', async () => {
    const response = await request(`localhost:${port}`).get('/api/users');
    expect(response.statusCode).toBe(200);
    console.log(response.body);
    expect(response.body.data).toStrictEqual(usersExample);
  });
  test('Add new user', async () => {
    const userData: Omit<IUser, 'id'> = {
      username: 'Testing',
      age: 25,
      hobbies: ['Testing'],
    };
    const response = await request(`localhost:${port}`)
      .post('/api/users')
      .send(userData);
    expect(response.statusCode).toBe(201);
    newUserId = JSON.parse(response.text).id;
  });
  test('New user exists', async () => {
    const response = await request(`localhost:${port}`).get(
      `/api/users/${newUserId}`,
    );
    expect(response.statusCode).toEqual(200);
  });
  test('Update added user', async () => {
    const userData: Omit<IUser, 'id'> = {
      username: 'Testing',
      age: 25,
      hobbies: ['Testing', 'Testing-2'],
    };
    const response = await request(`localhost:${port}`)
      .put(`/api/users/${newUserId}`)
      .send(userData);
    expect(response.statusCode).toEqual(201);
    const responseWithAllUsers = await request(`localhost:${port}`).get(
      '/api/users',
    );
    const parsedData = JSON.parse(responseWithAllUsers.text);
    const newUser = parsedData.data.find(
      (item: IUser) => item.id === newUserId,
    );
    expect(newUser.hobbies).toStrictEqual(['Testing', 'Testing-2']);
  });
  test('Delete added user', async () => {
    const response = await request(`localhost:${port}`).delete(
      `/api/users/${newUserId}`,
    );
    expect(response.statusCode).toEqual(204);
  });
  test('Check deleted user', async () => {
    const response = await request(`localhost:${port}`).get(
      `/api/users/${newUserId}`,
    );
    expect(response.statusCode).toEqual(404);
  });
});
