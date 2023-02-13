import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Base from '@common/models/base';
import CourseEntity from '@course/models/course.model';

@Entity('category')
class CategoryEntity extends Base {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ type: 'varchar', length: 255 })
  @Index({ fulltext: true })
  title: string;

  @ManyToMany(() => CourseEntity, (course) => course.categories)
  @JoinTable({ name: 'course_category' })
  courses: Promise<CourseEntity[]>;
}

export default CategoryEntity;
