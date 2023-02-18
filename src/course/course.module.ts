import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import CourseEntity from '@course/models/course.model';
import CourseService from '@course/services/course.service';
import CourseController from '@course/controllers/course.controller';
import LoggerModule from '@logger/logger.module';
import CategoryModule from '@category/category.module';
import CategoryEntity from '@category/models/category.model';
import AdminEntity from '@user/models/admin.model';
import StorageModule from '@storage/storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CourseEntity, CategoryEntity, AdminEntity]),
    LoggerModule,
    CategoryModule,
    StorageModule,
  ],
  providers: [CourseService],
  controllers: [CourseController],
})
class CourseModule {}

export default CourseModule;
