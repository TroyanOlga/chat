/* eslint-disable no-unused-vars */
const dbData = {
  rooms: [0],
  'user:1:rooms': [0],
  'user:2:rooms': [0],
  messages: {
    'room:1': [
      '{"from":1,"dateTime":1641756413333,"message":"message","username":"username"}',
    ],
  },
  user: {
    'user:1': {
      username: 'username',
    },
  },
  usernames: {
    username1: 1,
  },
  totalUsers: 1,
};

const IORedis = jest.genMockFromModule('ioredis');
IORedis.prototype.smembers = jest.fn((key) => dbData[key]);
IORedis.prototype.zrevrange = jest.fn((key, start, stop) => dbData.messages[key]);
IORedis.prototype.hget = jest.fn((key, field) => dbData.user[key][field]);
IORedis.prototype.zadd = jest.fn((key, score, member) => 1);
IORedis.prototype.sismember = jest.fn((key, member) => dbData[key][member]);
IORedis.prototype.get = jest.fn((key) => dbData[key]);
IORedis.prototype.hset = jest.fn((key, field, value) => 1);
IORedis.prototype.set = jest.fn((key, value) => 'OK');
IORedis.prototype.sadd = jest.fn((key, member) => 1);

module.exports = IORedis;
