import {
  CacheInterceptor,
  CacheModule,
  ClassSerializerInterceptor,
  Module,
} from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bull';
import dataSourceOptions from '@database/config/data-source.config';
import eventOptions from '@event/config/event.config';
import queueOptions from '@queue/config/queue.config';
import AuthModule from '@auth/auth.module';
import CategoryModule from '@category/category.module';
import CourseModule from '@course/course.module';
import UserModule from '@user/user.module';
import FileModule from '@file/file.module';
import SectionModule from '@section/section.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    EventEmitterModule.forRoot(eventOptions),
    BullModule.forRoot(queueOptions),
    CacheModule.register(),
    AuthModule,
    UserModule,
    CategoryModule,
    CourseModule,
    SectionModule,
    FileModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
class AppModule {}

export default AppModule;
