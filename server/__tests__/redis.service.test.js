import redisService from '../redis.service.js';

describe('getRooms', () => {
  it('should return array of room ids', async () => {
    const result = await redisService.getRooms();
    expect(result).toEqual([0]);
  });
});

describe('getMessages', () => {
  it('should return array of messages depending on room id', async () => {
    const result = await redisService.getMessages(1);
    const expectedResult = ['{"from":1,"dateTime":1641756413333,"message":"message","username":"username"}'];
    expect(result).toEqual(expectedResult);
  });
});

describe('getUser', () => {
  it('should return username based on user id', async () => {
    const result = await redisService.getUser(1);
    const expectedResult = 'username';
    expect(result).toEqual(expectedResult);
  });
});

describe('saveMessage', () => {
  it('should not throw error', async () => {
    await expect(redisService.saveMessage(1, { from: 1, dateTime: 12345 })).resolves.not.toThrow();
  });
});

describe('checkIfUsernameTaken', () => {
  it('should return true if taken and false if not', async () => {
    const result = await redisService.checkIfUsernameTaken('username1');
    expect(result).toEqual(true);
    const result2 = await redisService.checkIfUsernameTaken('username');
    expect(result2).toEqual(false);
  });
});

describe('getAllRoomsForUser', () => {
  it('should return array of rooms based on user id', async () => {
    const result = await redisService.getAllRoomsForUser(1);
    const expectedResult = [0];
    expect(result).toEqual(expectedResult);
  });
});

describe('addUser', () => {
  it('should add user without error', async () => {
    const result = await redisService.addUser('username');
    const expectedResult = { username: 'username', userId: 2, rooms: [0] };
    expect(result).toEqual(expectedResult);
  });
});
