import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import Base from '@database/models/base';
import CourseEntity from '@course/models/course.model';
import UserEntity from '@user/models/user.model';

@Entity('category')
class CategoryEntity extends Base {
  @Column({ type: 'varchar', length: 255, unique: true })
  @Index({ fulltext: true })
  title: string;

  @ManyToMany(() => CourseEntity, (course) => course.categories)
  courses: Promise<CourseEntity[]>;

  @ManyToOne(() => UserEntity, (admin) => admin.categories)
  @JoinColumn({ name: 'admin_id' })
  admin: Promise<UserEntity>;
}

export default CategoryEntity;
