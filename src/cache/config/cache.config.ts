import { RedisClientOptions } from 'redis';
import { CacheModuleOptions } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-yet';

const cacheOptions: CacheModuleOptions<RedisClientOptions> = {
  store: redisStore,
  socket: {
    host: process.env.API_CACHE_HOSTNAME || 'localhost',
    port: +process.env.API_CACHE_PORT || 6379,
  },
};

export default cacheOptions;
