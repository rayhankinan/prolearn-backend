import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import CourseEntity from '@course/models/course.model';
import CourseService from '@course/services/course.service';
import CourseController from '@course/controllers/course.controller';
import LoggerModule from '@logger/logger.module';
import CategoryEntity from '@category/models/category.model';
import FileModule from '@file/file.module';
import UserEntity from '@user/models/user.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([CourseEntity, CategoryEntity, UserEntity]),
    FileModule,
    LoggerModule,
  ],
  providers: [CourseService],
  controllers: [CourseController],
})
class CourseModule {}

export default CourseModule;
