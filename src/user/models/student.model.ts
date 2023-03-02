import { ChildEntity, Column, JoinTable, ManyToMany } from 'typeorm';
import UserEntity from '@user/models/user.model';
import UserRole from '@user/enum/user-role';
import CourseEntity from '@course/models/course.model';

@ChildEntity('student')
class StudentEntity extends UserEntity {
  @Column({ type: 'enum', enum: UserRole, default: UserRole.STUDENT })
  readonly role: UserRole;

  @ManyToMany(() => CourseEntity, (course) => course.subscribers)
  @JoinTable({ name: 'course_student' })
  courses: Promise<CourseEntity[]>;
}

export default StudentEntity;
