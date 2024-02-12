import request from 'supertest';
import 'dotenv/config';
import { TUser } from 'routes/users/usersBehavior';

const hostname = '127.0.0.1';
const port = Number(process.env.PORT) ?? 3000;

const app = `http://${hostname}:${port}/`;

const wrongUser = {
  wrong: 1,
};

const correctUser: TUser = {
  username: 'new user',
  age: 20,
  hobbies: [],
};

describe('test error code', () => {
  test('unexisting endpoint', async () => {
    let res;
    res = await request(app).get('');
    expect(res.statusCode).toEqual(404);

    res = await request(app).get('/');
    expect(res.statusCode).toEqual(404);

    res = await request(app).get('api');
    expect(res.statusCode).toEqual(404);

    res = await request(app).get('api/wrong-endpoint');
    expect(res.statusCode).toEqual(404);
  });

  test('get user with wrong non UUID', async () => {
    const res = await request(app).get('api/users/123');
    expect(res.statusCode).toEqual(400);
  });

  test('get user with wrong UUID', async () => {
    const res = await request(app).get(
      'api/users/f73285ae-c08f-4063-8ac5-bb93ce5e1cbb',
    );
    expect(res.statusCode).toEqual(404);
  });

  test('put user with wrong non UUID', async () => {
    const res = await request(app).put('api/users/123');
    expect(res.statusCode).toEqual(400);
  });

  test('put user with wrong UUID', async () => {
    const res = await request(app).put(
      'api/users/f73285ae-c08f-4063-8ac5-bb93ce5e1cbb',
    );
    expect(res.statusCode).toEqual(404);
  });

  test('delete user with wrong non UUID', async () => {
    const res = await request(app).delete('api/users/123');
    expect(res.statusCode).toEqual(400);
  });

  test('delete user with wrong UUID', async () => {
    const res = await request(app).delete(
      'api/users/f73285ae-c08f-4063-8ac5-bb93ce5e1cbb',
    );
    expect(res.statusCode).toEqual(404);
  });
});

describe('api test', () => {
  test('full cycle scenario 1', async () => {
    let res;

    // get all users
    res = await request(app).get('api/users');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeDefined();

    // create new user with wrong body
    res = await request(app).post('api/users').send(wrongUser);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeDefined();

    // create new user with correct body
    res = await request(app).post('api/users').send(correctUser);
    expect(res.statusCode).toEqual(201);
    let newUser = res.body;

    // get new users
    res = await request(app).get(`api/users/${newUser.id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeDefined();

    // update user
    correctUser.age = 30;
    res = await request(app).put(`api/users/${newUser.id}`).send(correctUser);
    expect(res.statusCode).toEqual(200);
    expect(res.body.age).toBe(30);
    newUser = res.body;

    // get new users
    res = await request(app).get(`api/users/${newUser.id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.age).toBe(30);

    // find user in all users
    res = await request(app).get('api/users');
    expect(res.statusCode).toEqual(200);

    const foundUsers = res.body.filter((el: TUser) => el.id === newUser.id);
    expect(foundUsers.length).toBe(1);

    // delete users
    res = await request(app).delete(`api/users/${newUser.id}`);
    expect(res.statusCode).toEqual(204);

    // get deleted users
    res = await request(app).get(`api/users/${newUser.id}`);
    expect(res.statusCode).toEqual(404);
  });

  test('full cycle scenario 2', async () => {
    let res;

    // get all users
    res = await request(app).get('api/users');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeDefined();
    const count = res.body.length;

    // create new user with wrong body
    res = await request(app).post('api/users').send(correctUser);
    res = await request(app).post('api/users').send(correctUser);
    res = await request(app).post('api/users').send(correctUser);

    // check users length
    res = await request(app).get('api/users');
    expect(res.body.length).toEqual(count + 3);

    // delete users
    res = await request(app).delete(`api/users/${res.body[0].id}`);
    expect(res.statusCode).toEqual(204);

    // check users length
    res = await request(app).get('api/users');
    expect(res.body.length).toEqual(count + 2);
  });

  test('full cycle scenario 3', async () => {
    let res;

    // create new user with correct body
    res = await request(app).post('api/users').send(correctUser);
    expect(res.statusCode).toEqual(201);
    const newUser = res.body;

    // get new users
    res = await request(app).get(`api/users/${newUser.id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeDefined();

    // delete users
    res = await request(app).delete(`api/users/${newUser.id}`);
    expect(res.statusCode).toEqual(204);

    // delete unexists users
    res = await request(app).delete(`api/users/${newUser.id}`);
    expect(res.statusCode).toEqual(404);
  });
});
