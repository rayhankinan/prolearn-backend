import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import LoggerModule from '@logger/logger.module';
import QuizEntity from '@quiz/models/quiz.model';
import SectionEntity from '@section/models/section.model';
import QuizService from '@quiz/services/quiz.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuizEntity, SectionEntity]),
    LoggerModule,
  ],
  providers: [QuizService],
  controllers: [],
  exports: [QuizService],
})
class QuizModule {}

export default QuizModule;
