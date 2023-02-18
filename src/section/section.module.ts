import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import SectionEntity from '@section/models/section.model';
import MaterialEntity from '@section/models/material.model';
import SectionService from '@section/services/section.service';
import MaterialService from '@section/services/material.service';
import LoggerModule from '@logger/logger.module';
import StorageModule from '@storage/storage.module';
import CourseEntity from '@course/models/course.model';
import AdminEntity from '@user/models/admin.model';
import SectionController from './controllers/section.controller';

/* TODO: ADD CONTROLLERS  */

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
  controllers: [SectionController],
})
class SectionModule {}

export default SectionModule;
