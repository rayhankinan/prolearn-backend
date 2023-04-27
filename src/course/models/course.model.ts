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
import ColumnNumericTransformer from '@database/utils/column-numeric-transformer';
import CourseLevel from '@course/enum/course-level';
import CourseStatus from '@course/enum/course-status';
import SectionEntity from '@section/models/section.model';
import CategoryEntity from '@category/models/category.model';
import FileEntity from '@file/models/file.model';
import UserEntity from '@user/models/user.model';
import RatingEntity from '@rating/models/rating.model';

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

  @Column({
    type: 'numeric',
    precision: 2,
    scale: 1,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  rating_avg: number;

  @OneToOne(() => FileEntity, (file) => file.course, {
    nullable: true,
  })
  @JoinColumn({ name: 'file_id' })
  thumbnail: Promise<FileEntity>;

  @OneToMany(() => SectionEntity, (section) => section.course)
  sections: Promise<SectionEntity[]>;

  @OneToMany(() => RatingEntity, (rating) => rating.course)
  rating: Promise<RatingEntity[]>;

  @ManyToOne(() => UserEntity, (admin) => admin.courses)
  @JoinColumn({ name: 'admin_id' })
  admin: Promise<UserEntity>;

  @ManyToMany(() => CategoryEntity, (category) => category.courses)
  @JoinTable({ name: 'course_category' })
  categories: Promise<CategoryEntity[]>;

  @ManyToMany(() => UserEntity, (student) => student.courses_subscribed)
  @JoinTable({ name: 'course_user' })
  subscribers: Promise<UserEntity[]>;
}

export default CourseEntity;
