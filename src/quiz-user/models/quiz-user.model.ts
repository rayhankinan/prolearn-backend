import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import QuizEntity from '@quiz/models/quiz.model';
import UserEntity from '@user/models/user.model';
import Base from '@database/models/base';
import { Exclude } from 'class-transformer';

@Entity('quiz_user')
class QuizUserEntity extends Base {
  @ManyToOne(() => QuizEntity, (quiz) => quiz.users)
  @JoinColumn({ name: 'quiz_id' })
  @Exclude()
  quizzes: Promise<QuizEntity>;

  @ManyToOne(() => UserEntity, (user) => user.quizzes)
  @JoinColumn({ name: 'user_id' })
  @Exclude()
  users: Promise<UserEntity>;

  @Column({ type: 'int', default: 0 })
  correctAnswers: number;
}

export default QuizUserEntity;
