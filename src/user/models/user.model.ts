import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import Base from '@database/models/base';
import UserRole from '@user/enum/user-role';
import CourseEntity from '@course/models/course.model';
import FileEntity from '@file/models/file.model';
import CategoryEntity from '@category/models/category.model';
import QuizUserEntity from '@quiz-user/models/quiz-user.model';
import RatingEntity from '@rating/models/rating.model';

@Entity('user')
class UserEntity extends Base {
  @Column({ type: 'varchar', length: 255, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  @Exclude()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.STUDENT })
  readonly role: UserRole;

  @OneToMany(() => CourseEntity, (course) => course.admin)
  courses: Promise<CourseEntity[]>;

  @OneToMany(() => CategoryEntity, (category) => category.admin)
  categories: Promise<CategoryEntity[]>;

  @OneToMany(() => FileEntity, (file) => file.admin)
  files: Promise<FileEntity[]>;

  @OneToMany(() => QuizUserEntity, (quizUser) => quizUser.users)
  quizzes: Promise<QuizUserEntity[]>;

  @OneToMany(() => RatingEntity, (rating) => rating.user)
  ratings: Promise<RatingEntity[]>;

  @ManyToMany(() => CourseEntity, (course) => course.subscribers)
  courses_subscribed: Promise<CourseEntity[]>;
}

export default UserEntity;
