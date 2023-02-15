import { ChildEntity, Column, OneToMany } from 'typeorm';
import UserEntity from '@user/models/user.model';
import UserRole from '@user/enum/user-role';
import CourseEntity from '@course/models/course.model';
import FileEntity from '@file/models/file.model';

@ChildEntity('admin')
class AdminEntity extends UserEntity {
  @Column({ type: 'enum', enum: UserRole, default: UserRole.ADMIN })
  readonly role: UserRole;

  @OneToMany(() => CourseEntity, (course) => course.admin)
  courses: Promise<CourseEntity[]>;

  @OneToMany(() => FileEntity, (file) => file.admin)
  files: Promise<FileEntity[]>;
}

export default AdminEntity;
