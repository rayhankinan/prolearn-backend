import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import LoggerModule from '@logger/logger.module';
import CourseEntity from '@course/models/course.model';
import UserEntity from '@user/models/user.model';
import SectionEntity from '@section/models/section.model';
import SectionService from '@section/services/section.service';
import SectionController from '@section/controllers/section.controller';
import FileModule from '@file/file.module';
import QuizModule from '@quiz/quiz.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SectionEntity, CourseEntity, UserEntity]),
    FileModule,
    QuizModule,
    LoggerModule,
  ],
  providers: [SectionService],
  controllers: [SectionController],
})
class SectionModule {}

export default SectionModule;
