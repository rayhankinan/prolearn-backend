import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import Base from '@database/models/base';
import CourseEntity from '@course/models/course.model';
import AdminEntity from '@user/models/admin.model';

@Entity('category')
class CategoryEntity extends Base {
  @Column({ type: 'varchar', length: 255, unique: true })
  @Index({ fulltext: true })
  title: string;

  @ManyToMany(() => CourseEntity, (course) => course.categories)
  courses: Promise<CourseEntity[]>;

  @ManyToOne(() => AdminEntity, (admin) => admin.courses)
  @JoinColumn({ name: 'admin_id' })
  admin: Promise<AdminEntity>;
}

export default CategoryEntity;
