import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import type { RedisClientOptions } from 'redis';
import dataSourceOptions from '@common/config/data-source.config';

/* TODO: ADD CACHING LAYER */

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    EventEmitterModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
