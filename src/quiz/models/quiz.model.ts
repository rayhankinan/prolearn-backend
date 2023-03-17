import { Column, Entity, Index, OneToOne } from 'typeorm';
import Base from '@database/models/base';
import QuizType from '@quiz/types/quiz.type';
import SectionEntity from '@section/models/section.model';

@Entity('quiz')
class QuizEntity extends Base {
  @Column({ type: 'jsonb' })
  content: QuizType;

  @OneToOne(() => SectionEntity, (section) => section.quiz, { nullable: true })
  section?: Promise<SectionEntity>;
}

export default QuizEntity;
