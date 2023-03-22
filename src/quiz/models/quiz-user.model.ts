import { Column, 
  Entity,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import QuizEntity from '@quiz/models/quiz.model';
import UserEntity from '@user/models/user.model';

@Entity('quiz')
class QuizUserEntity {
  @PrimaryColumn()
  @ManyToOne(() => UserEntity, (user) => user.quizzes)
  users: Promise<UserEntity>;

  @PrimaryColumn()
  @ManyToOne(() => QuizEntity, (quiz) => quiz.users)
  quizzes: Promise<QuizEntity>;

  @Column()
  score: number;
}

export default QuizUserEntity;
