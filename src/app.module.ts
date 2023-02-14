import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisClientOptions } from 'redis';
import { EventEmitterModule } from '@nestjs/event-emitter';
import dataSourceOptions from '@database/config/data-source.config';
import cacheOptions from '@cache/config/cache.config';
import CategoryModule from '@category/category.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    CacheModule.register<RedisClientOptions>(cacheOptions),
    EventEmitterModule.forRoot(),
    CategoryModule,
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
