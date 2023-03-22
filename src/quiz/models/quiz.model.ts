import { Column, 
  Entity, 
  OneToMany, 
  OneToOne 
} from 'typeorm';
import Base from '@database/models/base';
import QuizType from '@quiz/types/quiz.type';
import SectionEntity from '@section/models/section.model';
import QuizUserEntity from '@quizuser/models/quizuser.model';

@Entity('quiz')
class QuizEntity extends Base {
  @Column({ type: 'jsonb' })
  content: QuizType;

  @OneToOne(() => SectionEntity, (section) => section.quiz)
  section: Promise<SectionEntity>;

  @OneToMany(() => QuizUserEntity, (quizUser) => quizUser.quizzes)
  users: Promise<QuizUserEntity[]>;
}

export default QuizEntity;
