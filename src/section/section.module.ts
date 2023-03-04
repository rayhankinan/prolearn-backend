import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import LoggerModule from '@logger/logger.module';
import CourseEntity from '@course/models/course.model';
import UserEntity from '@user/models/user.model';
import SectionEntity from '@section/models/section.model';
import MaterialEntity from '@section/models/material.model';
import VideoEntity from '@section/models/video.model';
import SectionService from '@section/services/section.service';
import MaterialService from '@section/services/material.service';
import VideoService from '@section/services/video.service';
import SectionController from '@section/controllers/section.controller';
import MaterialController from '@section/controllers/material.controller';
import VideoController from '@section/controllers/video.controller';
import FileModule from '@file/file.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SectionEntity,
      MaterialEntity,
      VideoEntity,
      CourseEntity,
      UserEntity,
    ]),
    FileModule,
    LoggerModule,
  ],
  providers: [SectionService, MaterialService, VideoService],
  controllers: [SectionController, MaterialController, VideoController],
})
class SectionModule {}

export default SectionModule;
