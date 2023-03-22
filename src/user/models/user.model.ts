import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import Base from '@database/models/base';
import UserRole from '@user/enum/user-role';
import CourseEntity from '@course/models/course.model';
import FileEntity from '@file/models/file.model';
import CategoryEntity from '@category/models/category.model';
import QuizUserEntity from '@quizuser/models/quizuser.model';

@Entity('user')
class UserEntity extends Base {
  @Column({ type: 'varchar', length: 255, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  @Exclude()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.STUDENT})
  readonly role: UserRole;

  @OneToMany(() => CourseEntity, (course) => course.admin)
  courses: Promise<CourseEntity[]>;

  @OneToMany(() => CategoryEntity, (category) => category.admin)
  categories: Promise<CategoryEntity[]>;

  @OneToMany(() => FileEntity, (file) => file.admin)
  files: Promise<FileEntity[]>;

  @ManyToMany(() => CourseEntity, (course) => course.subscribers)
  @JoinTable({ name: 'course_user' })
  courses_subscribed: Promise<CourseEntity[]>;

  @OneToMany(() => QuizEntity, (quiz) => quiz.users)
  quizzes: Promise<QuizEntity[]>;
}

export default UserEntity;
