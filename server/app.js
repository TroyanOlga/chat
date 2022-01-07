import http from 'http';
import router from './routing.service.js';
import initWebsocket from './websocket.service.js';

const server = http.createServer((req, res) => {
  router.routing(req, res);
});

initWebsocket(server);

server.listen(3000, () => {
  console.log('server start at port 3000');
});
