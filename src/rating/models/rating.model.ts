import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import Base from '@database/models/base';
import UserEntity from '@user/models/user.model';
import CourseEntity from '@course/models/course.model';

@Entity('rating')
class RatingEntity extends Base {
  @Column({ type: 'numeric', precision: 2, scale: 1 })
  rating: number;

  @ManyToOne(() => UserEntity, (user) => user.ratings)
  @JoinColumn({ name: 'user_id' })
  user: Promise<UserEntity>;

  @ManyToOne(() => CourseEntity, (course) => course.rating)
  @JoinColumn({ name: 'course_id' })
  course: Promise<CourseEntity>;
}

export default RatingEntity;
