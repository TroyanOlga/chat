import http from 'http';
import routing from './routing.service.js';
import initWebsocket from './websocket.service.js';
import initTcpServer from './tcp.connection.service.js';

const server = http.createServer(routing);

initWebsocket(server);
initTcpServer();

server.listen(3000, () => {
  console.log('server start at port 3000'); // eslint-disable-line no-console
});
