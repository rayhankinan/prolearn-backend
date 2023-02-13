import {
  Column,
  Entity,
  JoinColumn,
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
  id: number;

  @Column({ default: 'No Title' })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: CourseLevel.BEGINNER })
  difficulty: CourseLevel;

  @Column({ default: CourseStatus.DRAFT })
  status: CourseStatus;

  @OneToMany(() => SectionEntity, (section) => section.course)
  sections: SectionEntity[];

  @ManyToMany(() => CategoryEntity, (category) => category.courses)
  categories: CategoryEntity[];
}

export default CourseEntity;
