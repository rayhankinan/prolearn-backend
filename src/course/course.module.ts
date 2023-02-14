import { Module } from '@nestjs/common';
import DatabaseModule from '@database/database.module';
import LoggerModule from '@logger/logger.module';
import { CourseService } from '@course/services/course.service';
import { CourseController } from '@course/controllers/course.controller';

@Module({
  imports: [DatabaseModule, LoggerModule],
  providers: [CourseService],
  controllers: [CourseController],
})
class CourseModule {}

export default CourseModule;
