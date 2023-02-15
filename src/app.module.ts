import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bull';
import { RedisClientOptions } from 'redis';
import dataSourceOptions from '@database/config/data-source.config';
import cacheOptions from '@cache/config/cache.config';
import eventOptions from '@event/config/event.config';
import queueOptions from '@queue/config/queue.config';
import CategoryModule from '@category/category.module';
import { UserModule } from '@user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    CacheModule.register<RedisClientOptions>(cacheOptions),
    EventEmitterModule.forRoot(eventOptions),
    BullModule.forRoot(queueOptions),
    CategoryModule,
    UserModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
class AppModule {}

export default AppModule;
