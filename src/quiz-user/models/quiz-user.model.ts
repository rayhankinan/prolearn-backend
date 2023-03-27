import { Column, Entity, ManyToOne } from 'typeorm';
import QuizEntity from '@quiz/models/quiz.model';
import UserEntity from '@user/models/user.model';
import Base from '@database/models/base';
import { Exclude } from 'class-transformer';

@Entity('quiz_user')
class QuizUserEntity extends Base {
  @Exclude()
  @ManyToOne(() => QuizEntity, (quiz) => quiz.users)
  quizzes: Promise<QuizEntity>;

  @Exclude()
  @ManyToOne(() => UserEntity, (user) => user.quizzes)
  users: Promise<UserEntity>;

  @Column()
  correct_answer: number;
}

export default QuizUserEntity;
