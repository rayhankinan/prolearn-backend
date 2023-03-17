import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import LoggerModule from '@logger/logger.module';
import QuizEntity from '@quiz/models/quiz.model';

@Module({
  imports: [TypeOrmModule.forFeature([QuizEntity]), LoggerModule],
  providers: [],
  controllers: [],
})
class QuizModule {}

export default QuizModule;
