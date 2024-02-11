import * as http from 'http';

const hostname = '127.0.0.1';
const port = 3000;

const posts = [
  {
    title: 'Lorem ipsum',
    content: 'Dolor sit amet',
  },
];

const server = http.createServer((request, response) => {
  console.log('req', request.url);

  switch (request.url) {
    case '/posts': {
      response.statusCode = 200;
      if (request.method === 'GET') {
        response.end(JSON.stringify(posts));
      }
      break;
    }
    case '/':
      response.statusCode = 200;
      response.setHeader('Content-Type', 'text/plain');
      response.end('Hello World\n');
      break;
    default: {
      response.statusCode = 404;
      response.end();
    }
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
