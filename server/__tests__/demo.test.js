import redisService from '../redis.service.js';

describe('getRooms', () => {
  it('should return array of room ids', async () => {
    const result = await redisService.getRooms();
    expect(result).toEqual([0]);
  });
});
