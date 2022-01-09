import { WebSocketServer } from 'ws';
import event from './event.service.js';

export default function initWebsocket(server) {
  const wss = new WebSocketServer({ server });
  wss.on('connection', (ws) => {
    ws.on('message', (data) => {
      console.log('received: %s', data); // eslint-disable-line no-console
    });

    ws.send('Connection established');
    event.on('newMessage', ((message) => {
      ws.send(message);
    }));
  });
}
