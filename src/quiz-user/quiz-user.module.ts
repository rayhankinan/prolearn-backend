import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import LoggerModule from '@logger/logger.module';
import QuizUserEntity from '@quizuser/models/quiz-user.model';

@Module({
  imports: [TypeOrmModule.forFeature([QuizUserEntity]), LoggerModule],
  providers: [],
  controllers: [],
  exports: [],
})
class QuizUserModule {}

export default QuizUserModule;
