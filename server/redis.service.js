import Redis from 'ioredis';

const redis = new Redis(); // uses defaults unless given configuration object
export default {
  async getMessages() {
    await redis.get('foo');
  },
  async saveMessage() {
    await redis.set('foo', 'bar');
  },
  async addUser(username) {
    const totalUsers = await redis.get('totalUsers'); // todo existing users + when no users are present in db
    console.log(totalUsers);
    const newTotalUsers = +totalUsers + 1;
    console.log(`user:${newTotalUsers}`);
    await redis.hset(`user:${newTotalUsers}`, 'username', username);
    await redis.set('totalUsers', newTotalUsers);
  },
};
