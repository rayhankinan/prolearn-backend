import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import Base from '@database/models/base';
import CourseLevel from '@course/enum/course-level';
import CourseStatus from '@course/enum/course-status';
import SectionEntity from '@section/models/section.model';
import CategoryEntity from '@category/models/category.model';
import AdminEntity from '@user/models/admin.model';
import FileEntity from '@file/models/file.model';
import UserEntity from '@user/models/user.model';
import StudentEntity from '@user/models/student.model';

@Entity('course')
class CourseEntity extends Base {
  @Column({ type: 'varchar', length: 255, default: 'No Title' })
  @Index({ fulltext: true })
  title: string;

  @Column({ nullable: true, type: 'text' })
  description?: string;

  @Column({ type: 'enum', enum: CourseLevel, default: CourseLevel.BEGINNER })
  difficulty: CourseLevel;

  @Column({ type: 'enum', enum: CourseStatus, default: CourseStatus.ACTIVE })
  status: CourseStatus;

  @OneToOne(() => SectionEntity, (section) => section.adjoinedCourse, {
    nullable: true,
  })
  @JoinColumn({ name: 'section_id' })
  parentSection: Promise<SectionEntity>;

  @OneToOne(() => FileEntity, (file) => file.course, {
    nullable: true,
  })
  @JoinColumn({ name: 'file_id' })
  thumbnail: Promise<FileEntity>;

  @ManyToMany(() => CategoryEntity, (category) => category.courses)
  @JoinTable({ name: 'course_category' })
  categories: Promise<CategoryEntity[]>;

  @ManyToOne(() => AdminEntity, (admin) => admin.courses)
  @JoinColumn({ name: 'admin_id' })
  admin: Promise<AdminEntity>;

  @ManyToMany(() => StudentEntity, (student) => student.courses)
  subscribers: Promise<StudentEntity[]>;
}

export default CourseEntity;
