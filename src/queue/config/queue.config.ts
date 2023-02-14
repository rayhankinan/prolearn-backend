import { BullRootModuleOptions } from '@nestjs/bull';

const queueOptions: BullRootModuleOptions = {
  redis: {
    host: process.env.QUEUE_CACHE_HOSTNAME || 'localhost',
    port: +process.env.QUEUE_CACHE_PORT || 6379,
  },
};

export default queueOptions;
