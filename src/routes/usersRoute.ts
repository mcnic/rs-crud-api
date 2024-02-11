import * as http from 'http';

type TUsers = {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
};

const users: TUsers[] = [];

export const usersRoute = (
  request: http.IncomingMessage,
  response: http.ServerResponse<http.IncomingMessage> & {
    req: http.IncomingMessage;
  },
) => {
  const splittedUrl = request.url?.split('/') ?? [];
  const id = splittedUrl[3];
  console.log('users', splittedUrl, id);

  switch (request.method) {
    case 'GET': {
      if (!id) {
        response.statusCode = 200;
        response.end(JSON.stringify(users));
        break;
      }

      response.statusCode = 404;
      response.setHeader('Content-Type', 'text/plain');
      response.end('user not found\n');
      break;
    }
    case 'POST': {
      response.statusCode = 200;
      response.end(JSON.stringify(users));
      break;
    }
    default: {
      response.statusCode = 200;
      response.setHeader('Content-Type', 'text/plain');
      response.end('users\n');
    }
  }
};
