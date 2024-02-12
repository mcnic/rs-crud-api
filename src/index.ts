import { createServer } from 'node:http';
import { availableParallelism } from 'node:os';
import cluster from 'node:cluster';
import process from 'node:process';
import 'dotenv/config';
import { usersRoute } from './routes/users';
import { clearStore, getStore } from './db/store';

const hostname = '127.0.0.1';

const createServerNode = (port: number) => {
  const server = createServer((request, response) => {
    const splittedUrl = request.url?.split('/') ?? [];

    if (splittedUrl[1] !== 'api') {
      response.statusCode = 404;
      response.setHeader('Content-Type', 'text/plain');
      response.end('wrong endpoint\n');
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
        response.end('wrong endpoint\n');
      }
    }
  });

  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
};

getStore().then((res) => {
  console.log('store data', res);
});

if (process.env.NODE_CLUSTER) {
  const numCPUs = availableParallelism();

  if (cluster.isPrimary) {
    clearStore();

    console.log(`Primary ${process.pid} is running`);

    for (let i = 0; i < numCPUs; i++) {
      cluster.fork({ port: 4001 + i });
    }

    cluster.on('exit', (worker) => {
      console.log(`worker ${worker.process.pid} died`);
    });
  } else {
    createServerNode(Number(process.env.port));
  }
} else {
  clearStore();

  createServerNode(Number(process.env.PORT) ?? 3000);
}
