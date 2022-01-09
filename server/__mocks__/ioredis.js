const dbData = {
  rooms: [0],
};

const IORedis = jest.genMockFromModule('ioredis');
IORedis.prototype.smembers = jest.fn(() => dbData.rooms);

module.exports = IORedis;
