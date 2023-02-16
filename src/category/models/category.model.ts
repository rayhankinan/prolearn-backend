import { Column, Entity, Index, JoinTable, ManyToMany } from 'typeorm';
import Base from '@database/models/base';
import CourseEntity from '@course/models/course.model';

@Entity('category')
class CategoryEntity extends Base {
  @Column({ type: 'varchar', length: 255 })
  @Index({ fulltext: true })
  title: string;

  @ManyToMany(() => CourseEntity, (course) => course.categories)
  @JoinTable({ name: 'course_category' })
  courses: CourseEntity[];
}

export default CategoryEntity;
