import Redis from 'ioredis';

const redis = new Redis(); // uses defaults unless given configuration object
export default {
  async getMessages(roomId) {
    return redis.zrevrange(`room:${roomId}`, 0, 50);
  },
  async saveMessage(roomId, data) {
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
  async addUser(username) {
    const totalUsers = await redis.get('totalUsers'); // todo existing users + when no users are present in db
    const newTotalUsers = +totalUsers + 1;
    const userId = newTotalUsers;
    const result = await redis.hset(`user:${userId}`, 'username', username);
    if (result !== 1) { // TODO change when added existing users check
      throw new Error('Error during user addition');
    }
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
};
