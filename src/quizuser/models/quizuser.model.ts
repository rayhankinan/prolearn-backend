import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import QuizEntity from '@quiz/models/quiz.model';
import UserEntity from '@user/models/user.model';
import Base from '@database/models/base';

@Entity('quiz_user')
class QuizUserEntity extends Base {
  @ManyToOne(() => QuizEntity, (quiz) => quiz.users)
  quizzes: Promise<QuizEntity>;

  @ManyToOne(() => UserEntity, (user) => user.quizzes)
  users: Promise<UserEntity>;

  @Column()
  score: number;
}

export default QuizUserEntity;