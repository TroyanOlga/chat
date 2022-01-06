import http from 'http';
import redisService from './redis.service.js';

http.createServer((req, res) => {
  // try {
  switch (req.url) {
    case '/chat':
      if (req.method === 'GET') {
        const messages = redisService.getMessages()
          .then((result) => result)
          .catch((err) => {
            res.writeHead(err.code, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: err.message }));
          });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(messages));
      }
      break;
    case '/login':
      if (req.method === 'OPTIONS') {
        const headers = {
          'Access-Control-Allow-Origin': 'http://localhost:8080',
          'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
          'Access-Control-Allow-Headers': '*',
        };
        res.writeHead(204, headers);
        res.end();
        return;
      }
      if (req.method === 'POST') {
        let temporaryBody = '';
        req.on('data', (chunk) => {
          temporaryBody += chunk;
        });

        req.on('end', async () => {
          const body = JSON.parse(temporaryBody);
          if (!body?.name) {
            res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'http://localhost:8080' });
            res.write(JSON.stringify({ message: 'Name is missing!' }));
            res.end();
            return;
          }
          try {
            const user = await redisService.addUser(body.name);
            res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'http://localhost:8080' });
            res.write(JSON.stringify(user));
            res.end();
          } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'http://localhost:8080' });
            res.end(err.message);
          }
        });
      }
      break;
    default:
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Route not found' }));
  }
  // } catch (err) { // TODO add better error handling
  //   console.log(err);
  //   res.writeHead(500, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'http://localhost:8080' });
  //   res.end(err.message);
  // }
}).listen(3000, () => {
  console.log('server start at port 3000');
});
