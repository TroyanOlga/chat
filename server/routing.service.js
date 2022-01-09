import redisService from './redis.service.js';
import event from './event.service.js';

const standardHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': process.env.FRONTEND_URL,
};

export default function routing(req, res) {
  switch (req.method) {
    case 'OPTIONS':
      // eslint-disable-next-line no-case-declarations
      const headers = {
        ...standardHeaders,
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Allow-Headers': '*',
      };
      res.writeHead(204, headers);
      res.end();
      break;
    case 'GET':
      if (req.url === '/chat') {
        redisService.getRooms()
          .then((rooms) => {
            res.writeHead(200, standardHeaders);
            res.end(JSON.stringify(rooms));
          })
          .catch((err) => {
            console.error(err); // eslint-disable-line no-console
            res.writeHead(500, standardHeaders);
            res.end(err.message);
          });
      } else if (/\/room\/[0-9]*/.test(req.url)) {
        const roomId = req.url.split('/').pop();
        redisService.getMessages(roomId)
          .then((data) => {
            const messages = data.map((string) => JSON.parse(string));
            res.writeHead(200, standardHeaders);
            res.end(JSON.stringify(messages));
          })
          .catch((err) => {
            console.error(err); // eslint-disable-line no-console
            res.writeHead(500, standardHeaders);
            res.end(err.message);
          });
      }
      break;
    case 'POST':
      if (/\/room\/[0-9]*/.test(req.url)) {
        let temporaryBody = '';
        req.on('data', (chunk) => {
          temporaryBody += chunk;
        });

        req.on('end', async () => {
          const body = JSON.parse(temporaryBody);
          if (!body?.message) {
            res.writeHead(400, standardHeaders);
            res.write(JSON.stringify({ message: 'No data received!' }));
            res.end();
            return;
          }
          try {
            const roomId = req.url.split('/').pop();
            await redisService.saveMessage(roomId, body);
            event.emit('newMessage', JSON.stringify(body));
            res.writeHead(201, standardHeaders);
            res.end();
          } catch (err) {
            console.error(err); // eslint-disable-line no-console
            res.writeHead(500, standardHeaders);
            res.end(err.message);
          }
        });
        // TODO add proper auth
      } else if (req.url === '/login') {
        let temporaryBody = '';
        req.on('data', (chunk) => {
          temporaryBody += chunk;
        });

        req.on('end', async () => {
          const body = JSON.parse(temporaryBody);
          if (!body?.name) {
            res.writeHead(400, standardHeaders);
            res.write(JSON.stringify({ message: 'Name is missing!' }));
            res.end();
            return;
          }
          try {
            const user = await redisService.addUser(body.name);
            res.writeHead(201, standardHeaders);
            res.write(JSON.stringify(user));
            res.end();
          } catch (err) {
            console.error(err); // eslint-disable-line no-console
            res.writeHead(500, standardHeaders);
            res.end(err.message);
          }
        });
      } else if (req.url === '/logout') {
        let temporaryBody = '';
        req.on('data', (chunk) => {
          temporaryBody += chunk;
        });

        req.on('end', async () => {
          const body = JSON.parse(temporaryBody);
          if (!body?.user) {
            res.writeHead(400, standardHeaders);
            res.write(JSON.stringify({ message: 'User id is missing!' }));
            res.end();
            return;
          }
          try {
            const user = await redisService.getUser(body.user);
            await redisService.markUsernameNotTaken(user);
            res.writeHead(204, standardHeaders);
            res.end();
          } catch (err) {
            console.error(err); // eslint-disable-line no-console
            res.writeHead(500, standardHeaders);
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
