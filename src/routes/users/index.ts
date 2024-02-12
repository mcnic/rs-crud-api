import { IncomingMessage, ServerResponse } from 'http';
import { deleteUsers, getUsers, postUser, putUser } from './usersBehavior';

export const usersRoute = (
  request: IncomingMessage,
  response: ServerResponse<IncomingMessage> & {
    req: IncomingMessage;
  },
) => {
  switch (request.method) {
    case 'GET': {
      getUsers(request, response);
      break;
    }
    case 'POST': {
      postUser(request, response);
      break;
    }
    case 'PUT': {
      putUser(request, response);
      break;
    }
    case 'DELETE': {
      deleteUsers(request, response);
      break;
    }
    default: {
      response.statusCode = 404;
      response.setHeader('Content-Type', 'text/plain');
      response.end('wrong users api request\n');
    }
  }
};
