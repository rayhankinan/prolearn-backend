import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import CourseEntity from '@course/models/course.model';
import CourseService from '@course/services/course.service';
import CourseController from '@course/controllers/course.controller';
import LoggerModule from '@logger/logger.module';
import ResponseModule from '@response/response.module';
import CategoryModule from '@category/category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CourseEntity]),
    LoggerModule,
    ResponseModule,
    CategoryModule,
  ],
  providers: [CourseService],
  controllers: [CourseController],
})

class CourseModule {}

export default CourseModule;
