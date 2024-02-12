import { ServerResponse, IncomingMessage } from 'http';
import { parse, v4 as uuidv4 } from 'uuid';

export type TUser = {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
};

const isBodyCorrect = (body: TUser): boolean =>
  !(!body || !body.username || !body.age || !Array.isArray(body.hobbies));

const users: TUser[] = [];

const testUserId = (
  userId: string,
  response: ServerResponse<IncomingMessage> & {
    req: IncomingMessage;
  },
) => {
  try {
    parse(userId);
    response.statusCode = 404;
    response.setHeader('Content-Type', 'text/plain');
    response.end('user not found\n');
    return;
  } catch (error) {
    response.statusCode = 400;
    response.setHeader('Content-Type', 'text/plain');
    response.end('invalid user\n');
    return;
  }
};

export const getUsers = (
  request: IncomingMessage,
  response: ServerResponse<IncomingMessage> & {
    req: IncomingMessage;
  },
) => {
  const userId = request.url?.split('/')[3] ?? '';

  if (!userId) {
    // get all users
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(users));
    return;
  }

  const user: TUser | undefined = users.filter((el) => el.id === userId)[0];

  // user found, response user data
  if (user) {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(user));
    return;
  }

  // user not found, testing userId
  testUserId(userId, response);
};

export const postUser = (
  request: IncomingMessage,
  response: ServerResponse<IncomingMessage> & {
    req: IncomingMessage;
  },
) => {
  let body = '';

  request.on('data', (chunk) => {
    body += chunk.toString();
  });

  request.on('end', () => {
    try {
      const user: TUser = JSON.parse(body);

      if (!isBodyCorrect(user)) {
        response.statusCode = 400;
        response.setHeader('Content-Type', 'text/plain');
        response.end('wrong data for create user');
        return;
      }
      user.id = uuidv4();
      users.push(user);
      response.statusCode = 201;
      response.setHeader('Content-Type', 'application/json');
      response.end(JSON.stringify(user));
      return;
    } catch (error) {
      response.statusCode = 500;
      response.setHeader('Content-Type', 'text/plain');
      response.end('server error\n');
      return;
    }
  });
};

export const putUser = (
  request: IncomingMessage,
  response: ServerResponse<IncomingMessage> & {
    req: IncomingMessage;
  },
) => {
  const userId = request.url?.split('/')[3] ?? '';

  if (!userId) {
    response.statusCode = 400;
    response.setHeader('Content-Type', 'application/json');
    response.end('user id not defined');
    return;
  }

  let body = '';

  request.on('data', (chunk) => {
    body += chunk.toString();
  });

  request.on('end', () => {
    try {
      let userNum: number = -1;
      users.forEach((el, num) => {
        if (el.id === userId) userNum = num;
      });

      // user found, update
      if (userNum >= 0) {
        users[userNum] = { ...users[userNum], ...JSON.parse(body) };

        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify(users[userNum]));
        return;
      }

      // user not found, testing userId
      testUserId(userId, response);
      return;
    } catch (error) {
      response.statusCode = 500;
      response.setHeader('Content-Type', 'text/plain');
      response.end('server error\n');
      return;
    }
  });
};

export const deleteUsers = (
  request: IncomingMessage,
  response: ServerResponse<IncomingMessage> & {
    req: IncomingMessage;
  },
) => {
  const userId = request.url?.split('/')[3] ?? '';

  if (!userId) {
    response.statusCode = 400;
    response.setHeader('Content-Type', 'text/plain');
    response.end('user id not defined');
    return;
  }

  let userNum: number = -1;
  users.forEach((el, num) => {
    if (el.id === userId) userNum = num;
  });

  // user found, delete
  if (userNum >= 0) {
    delete users[userNum];

    response.statusCode = 204;
    response.setHeader('Content-Type', 'text/plain');
    response.end('use deleted');
    return;
  }

  // user not found, testing userId
  testUserId(userId, response);
};
