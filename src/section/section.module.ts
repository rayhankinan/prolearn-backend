import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import SectionEntity from '@section/models/section.model';
import MaterialEntity from '@section/models/material.model';
import SectionService from './services/section.service';
import MaterialService from './services/material.service';
import LoggerModule from '@logger/logger.module';
import StorageModule from '@storage/storage.module';
import CourseEntity from '@course/models/course.model';
import AdminEntity from '@user/models/admin.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SectionEntity,
      MaterialEntity,
      CourseEntity,
      AdminEntity,
    ]),
    LoggerModule,
    StorageModule,
  ],
  providers: [SectionService, MaterialService],
  controllers: [],
})
class SectionModule {}

export default SectionModule;
