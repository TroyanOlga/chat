import net from 'net';
import redisService from './redis.service.js';
import event from './event.service.js';

export default function initTcpServer() {
  const server = net.createServer();

  server.on('connection', (connection) => {
    connection.write('Connected\r\n');
    connection.write('Please enter your name\r\n');
    connection.setEncoding('utf-8');

    let currentUser;
    connection.on('data', async (data) => {
      const message = [];
      // Push every keystroke into an array
      message.push(data);

      // Proceed only if the 'enter' key has been pressed
      if (data.endsWith('\n')) {
        const clientInput = message.join('').replace('\r\n', '');
        if (!currentUser) {
          const user = await redisService.addUser(clientInput);
          currentUser = user.userId;
          // TODO refactor for additional rooms
          const olderRoomMessages = (await redisService.getMessages(+user.rooms[0]))
            .map((string) => JSON.parse(string))
            .reverse();
          connection.write(`Welcome to general room, ${clientInput}`);
          olderRoomMessages.forEach((messageData) => {
            connection.write(`${messageData.username} on ${new Date(messageData.dateTime)}: ${messageData.message}\n`);
          });
        } else {
          // TODO refactor for additional rooms
          const defaultRoomId = 0;
          const messageData = {
            from: currentUser,
            dateTime: new Date().getTime(),
            message: clientInput,
          };
          await redisService.saveMessage(defaultRoomId, messageData);
          event.emit('newMessage', JSON.stringify(messageData));
        }
      }
    });
    event.on('newMessage', ((messageData) => {
      messageData = JSON.parse(messageData); // eslint-disable-line no-param-reassign
      const date = new Date(messageData.dateTime);
      connection.write(`${messageData.username} on ${date}: ${messageData.message}\n`);
    }));
  });

  server.on('close', () => {
    console.log('Server disconnected');
  });

  server.on('error', (error) => {
    console.log(`Error : ${error}`);
  });

  server.listen(3001);
}