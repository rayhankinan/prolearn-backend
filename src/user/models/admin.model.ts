import { ChildEntity, Column, OneToMany } from 'typeorm';
import UserEntity from '@user/models/user.model';
import UserRole from '@user/enum/user-role';
import CourseEntity from '@course/models/course.model';

@ChildEntity('admin')
class AdminEntity extends UserEntity {
  @Column({ type: 'enum', enum: UserRole, default: UserRole.ADMIN })
  readonly role: UserRole;

  @OneToMany(() => CourseEntity, (course) => course.admin)
  courses: Promise<CourseEntity[]>;
}

export default AdminEntity;
