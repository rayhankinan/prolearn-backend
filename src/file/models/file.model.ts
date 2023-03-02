import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import Base from '@database/models/base';
import AdminEntity from '@user/models/admin.model';
import CourseEntity from '@course/models/course.model';
import StorageType from '@storage/enum/storage-type';

@Entity('file')
class FileEntity extends Base {
  @Column({ type: 'varchar', length: 255 })
  @Index({ fulltext: true })
  name: string;

  @Column({ type: 'uuid' })
  @Exclude()
  uuid: string;

  @Column({ type: 'varchar', length: 255 })
  @Exclude()
  mimetype: string;

  @Column({ type: 'enum', enum: StorageType, default: StorageType.FILE })
  @Exclude()
  storageType: StorageType;

  @ManyToOne(() => AdminEntity, (admin) => admin.files)
  @JoinColumn({ name: 'admin_id' })
  admin: Promise<AdminEntity>;

  @OneToOne(() => CourseEntity, (course) => course.thumbnail, {
    nullable: true,
  })
  course: Promise<CourseEntity>;
}

export default FileEntity;
