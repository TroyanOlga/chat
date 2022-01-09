import Redis from 'ioredis';

const redis = new Redis({
  port: process.env.REDIS_PORT,
});
export default {
  async getMessages(roomId) {
    return redis.zrevrange(`room:${roomId}`, 0, 30);
  },
  async saveMessage(roomId, data) {
    const username = await this.getUser(data.from);
    data.username = username; // eslint-disable-line no-param-reassign
    await redis.zadd(`room:${roomId}`, data.dateTime, JSON.stringify(data));
  },
  async getRooms() {
    return redis.smembers('rooms');
  },
  async addRoom(roomId) {
    await redis.sadd('rooms', roomId);
  },
  async addUserToRoom(userId, roomId) {
    await redis.sadd(`user:${userId}:rooms`, roomId);
  },
  async getAllRoomsForUser(userId) {
    return redis.smembers(`user:${userId}:rooms`);
  },
  async checkIfUsernameTaken(username) {
    return (await redis.sismember('usernames', username)) === 1;
  },
  async markUsernameTaken(username) {
    await redis.sadd('usernames', username);
  },
  async markUsernameNotTaken(username) {
    await redis.srem('usernames', username);
  },
  async addUser(username) {
    const isUserNameTaken = await this.checkIfUsernameTaken(username);
    if (isUserNameTaken) {
      throw new Error('Username already taken!');
    }
    const totalUsers = await redis.get('totalUsers');
    const newTotalUsers = +totalUsers + 1;
    const userId = newTotalUsers;
    const result = await redis.hset(`user:${userId}`, 'username', username);
    if (result !== 1) {
      throw new Error('Error during user addition');
    }
    await this.markUsernameTaken(username);
    await redis.set('totalUsers', newTotalUsers);
    const rooms = await this.getRooms();
    const defaultRoom = 0;
    if (!rooms.length) {
      await this.addRoom(defaultRoom);
    }
    await this.addUserToRoom(userId, defaultRoom);
    const userRooms = await this.getAllRoomsForUser(userId);
    return { username, userId, rooms: userRooms };
  },
  async getUser(userId) {
    return redis.hget(`user:${userId}`, 'username');
  },
};
