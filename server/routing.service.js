import redisService from './redis.service.js';
import event from './event.service.js';

export default function routing(req, res) {
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
            event.emit('newMessage', JSON.stringify(body));
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
    // TODO add proper authentication
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
    // TODO update when proper authentication in place
    // and potentially move usernames to temporary reserved list when user is deleted
    case req.url === '/logout':
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
          if (!body?.user) {
            res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'http://localhost:8080' });
            res.write(JSON.stringify({ message: 'User id is missing!' }));
            res.end();
            return;
          }
          try {
            const user = await redisService.getUser(body.user);
            await redisService.markUsernameNotTaken(user);
            res.writeHead(204, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'http://localhost:8080' });
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
}
