import net from 'net';
import dayjs from 'dayjs';
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
      if (data.endsWith('\n') || data.endsWith('\r\n')) {
        const clientInput = message.join('').replace('\r\n', '').replace('\n', '');
        if (!currentUser) {
          let user;
          try {
            user = await redisService.addUser(clientInput);
          } catch (err) {
            connection.write(`${err.message}\n`);
            connection.write('Choose another name:\n');
            return;
          }
          currentUser = user;
          // TODO refactor for additional rooms
          const olderRoomMessages = (await redisService.getMessages(+user.rooms[0]))
            .map((string) => JSON.parse(string))
            .reverse();
          connection.write(`Welcome to general room, ${clientInput}\n`);
          olderRoomMessages.forEach((messageData) => {
            connection.write(`${messageData.username} on ${dayjs(messageData.dateTime).format('YYYY-MM-DD HH:mm')}: ${messageData.message}\n`);
          });
        } else {
          // TODO refactor for additional rooms
          const defaultRoomId = 0;
          const messageData = {
            from: currentUser.userId,
            dateTime: new Date().getTime(),
            message: clientInput,
          };
          await redisService.saveMessage(defaultRoomId, messageData);
          event.emit('newMessage', JSON.stringify(messageData));
        }
      }
    });
    connection.on('end', async () => {
      if (currentUser) {
        await redisService.markUsernameNotTaken(currentUser.username);
      }
    });
    event.on('newMessage', ((messageData) => {
      messageData = JSON.parse(messageData); // eslint-disable-line no-param-reassign
      const date = dayjs(messageData.dateTime).format('YYYY-MM-DD HH:mm');
      connection.write(`${messageData.username} on ${date}: ${messageData.message}\n`);
    }));
  });

  server.on('close', () => {
    console.log('Server disconnected'); // eslint-disable-line no-console
  });

  server.on('error', (error) => {
    console.log(`Error : ${error}`); // eslint-disable-line no-console
  });

  server.listen(3001);
}
