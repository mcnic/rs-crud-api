import * as http from 'http';
import { usersRoute } from './routes/usersRoute';

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((request, response) => {
  const splittedUrl = request.url?.split('/') ?? [];
  console.log('req', splittedUrl);

  if (splittedUrl[1] !== 'api') {
    response.statusCode = 404;
    response.end();
    return;
  }

  switch (splittedUrl[2]) {
    case 'users': {
      usersRoute(request, response);
      break;
    }
    default: {
      response.statusCode = 404;
      response.setHeader('Content-Type', 'text/plain');
      response.end('wrong URL\n');
    }
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
