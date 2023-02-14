import { RedisClientOptions } from 'redis';
import { CacheModuleOptions } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-yet';

const cacheOptions: CacheModuleOptions<RedisClientOptions> = {
  store: redisStore,
  socket: {
    host: process.env.REDIS_HOSTNAME || 'localhost',
    port: +process.env.REDIS_PORT || 6379,
  },
};

export default cacheOptions;
