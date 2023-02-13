import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import Base from '@common/models/base';
import CourseEntity from '@course/models/course.model';

@Entity('category')
class CategoryEntity extends Base {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'No Title' })
  title: string;

  @ManyToMany(() => CourseEntity, (course) => course.categories)
  courses: CourseEntity[];
}

export default CategoryEntity;
