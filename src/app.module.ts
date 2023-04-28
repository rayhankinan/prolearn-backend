import {
  CacheInterceptor,
  ClassSerializerInterceptor,
  Module,
} from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import dataSourceOptions from '@database/config/data-source.config';
import eventOptions from '@event/config/event.config';
import AuthModule from '@auth/auth.module';
import CategoryModule from '@category/category.module';
import CourseModule from '@course/course.module';
import UserModule from '@user/user.module';
import FileModule from '@file/file.module';
import SectionModule from '@section/section.module';
import QuizModule from '@quiz/quiz.module';
import QuizUserModule from '@quiz-user/quiz-user.module';
import JobsModule from '@jobs/jobs.module';
import RatingModule from '@rating/rating.module';
import RecommendationModule from '@recommendation/recommendation.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    EventEmitterModule.forRoot(eventOptions),
    CacheModule.register(),
    AuthModule,
    UserModule,
    CategoryModule,
    CourseModule,
    SectionModule,
    FileModule,
    QuizModule,
    QuizUserModule,
    JobsModule,
    RatingModule,
    RecommendationModule,
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
