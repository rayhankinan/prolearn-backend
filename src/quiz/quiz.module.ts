import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import LoggerModule from '@logger/logger.module';
import QuizEntity from '@quiz/models/quiz.model';
import SectionEntity from '@section/models/section.model';
import QuizService from '@quiz/services/quiz.service';
import QuizUserEntity from '@quizuser/models/quiz-user.model';
import UserEntity from '@user/models/user.model';
import QuizController from '@quiz/controllers/quiz.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QuizEntity,
      SectionEntity,
      QuizUserEntity,
      UserEntity,
    ]),
    LoggerModule,
  ],
  providers: [QuizService],
  controllers: [QuizController],
  exports: [QuizService],
})
class QuizModule {}

export default QuizModule;
