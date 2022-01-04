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
          console.log('AAAAA');
        });

        let body = '';
        req.on('end', () => {
          body = JSON.parse(temporaryBody);
          console.log(body);
          console.log('OUT', body);
          const user = redisService.addUser(body.name)
            .then((result) => result)
            .catch((err) => {
              res.writeHead(err.code, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: err.message }));
            });
          res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'http://localhost:8080' });
          res.write(JSON.stringify(user));
          res.end();
        });

        // if (!body?.name) {
        //   res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'http://localhost:8080' });
        //   res.write({ message: 'Name is missing!' });
        //   res.end();
        // }
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
