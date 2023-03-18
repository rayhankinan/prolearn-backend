import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import Base from '@database/models/base';
import CourseLevel from '@course/enum/course-level';
import CourseStatus from '@course/enum/course-status';
import SectionEntity from '@section/models/section.model';
import CategoryEntity from '@category/models/category.model';
import FileEntity from '@file/models/file.model';
import UserEntity from '@user/models/user.model';

@Entity('course')
class CourseEntity extends Base {
  @Column({ type: 'varchar', length: 255, default: 'No Title' })
  @Index({ fulltext: true })
  title: string;

  @Column({ nullable: true, type: 'text' })
  description?: string;

  @Column({ type: 'enum', enum: CourseLevel, default: CourseLevel.BEGINNER })
  difficulty: CourseLevel;

  @Column({ type: 'enum', enum: CourseStatus, default: CourseStatus.ACTIVE })
  status: CourseStatus;

  @OneToOne(() => FileEntity, (file) => file.course, {
    nullable: true,
  })
  @JoinColumn({ name: 'file_id' })
  thumbnail: Promise<FileEntity>;

  @OneToMany(() => SectionEntity, (section) => section.courses)
  sections: Promise<SectionEntity[]>;

  @ManyToMany(() => CategoryEntity, (category) => category.courses)
  @JoinTable({ name: 'course_category' })
  categories: Promise<CategoryEntity[]>;

  @ManyToOne(() => UserEntity, (admin) => admin.courses)
  @JoinColumn({ name: 'admin_id' })
  admin: Promise<UserEntity>;

  @ManyToMany(() => UserEntity, (student) => student.courses_subscribed)
  subscribers: Promise<UserEntity[]>;
}

export default CourseEntity;
