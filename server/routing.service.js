import { EventEmitter } from 'events';
import redisService from './redis.service.js';

const event = new EventEmitter();

export default {
  routing(req, res) {
    // try {
    switch (true) {
      case req.url === '/chat':
        if (req.method === 'GET') {
          redisService.getRooms()
            .then((rooms) => {
              res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'http://localhost:8080' });
              res.end(JSON.stringify(rooms));
            })
            .catch((err) => {
              res.writeHead(500, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'http://localhost:8080' });
              res.end(err.message);
            });
        }
        break;
      case /\/room\/[0-9]*/.test(req.url):
        if (req.method === 'GET') {
          const roomId = req.url.split('/').pop();
          redisService.getMessages(roomId)
            .then((data) => {
              const messages = data.map((string) => JSON.parse(string));
              res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'http://localhost:8080' });
              res.end(JSON.stringify(messages));
            })
            .catch((err) => {
              res.writeHead(500, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'http://localhost:8080' });
              res.end(err.message);
            });
        }
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
            if (!body?.message) {
              res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'http://localhost:8080' });
              res.write(JSON.stringify({ message: 'No data received!' }));
              res.end();
              return;
            }
            try {
              const roomId = req.url.split('/').pop();
              await redisService.saveMessage(roomId, body);
              event.emit('message', JSON.stringify(body));
              res.writeHead(201, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'http://localhost:8080' });
              res.end();
            } catch (err) {
              console.error(err);
              res.writeHead(500, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'http://localhost:8080' });
              res.end(err.message);
            }
          });
        }
        break;
      case req.url === '/login':
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
              res.writeHead(201, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'http://localhost:8080' });
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
  },
  event,
};
