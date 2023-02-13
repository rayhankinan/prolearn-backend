import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Base from '@common/models/base';
import CourseLevel from '@course/enum/course-level';
import CourseStatus from '@course/enum/course-status';
import SectionEntity from '@section/models/section.model';
import CategoryEntity from '@category/models/category.model';

@Entity('course')
class CourseEntity extends Base {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ default: 'No Title', type: 'varchar', length: 255 })
  @Index({ fulltext: true })
  title: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ default: CourseLevel.BEGINNER })
  difficulty: CourseLevel;

  @Column({ default: CourseStatus.DRAFT })
  status: CourseStatus;

  @OneToMany(() => SectionEntity, (section) => section.course)
  sections: Promise<SectionEntity[]>;

  @ManyToMany(() => CategoryEntity, (category) => category.courses)
  @JoinTable({ name: 'course_category' })
  categories: Promise<CategoryEntity[]>;
}

export default CourseEntity;
