import { WebSocketServer } from 'ws';
import router from './routing.service.js';

export default function initWebsocket(server) {
  const wss = new WebSocketServer({ server });
  wss.on('connection', (ws) => {
    ws.on('message', (data) => {
      console.log('received: %s', data);
    });

    ws.send('Connection established');
    router.event.on('message', ((message) => {
      console.log('HERE');
      ws.send(message);
    }));
  });
}
