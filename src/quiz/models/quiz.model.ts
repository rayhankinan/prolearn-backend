import { Column, Entity, Index } from 'typeorm';
import Base from '@database/models/base';
import QuizType from '@quiz/types/quiz.type';

@Entity('quiz')
class QuizEntity extends Base {
  @Column({ type: 'jsonb' })
  quiz: QuizType;
}

export default QuizEntity;
