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
import CourseEntity from '@course/models/course.model';
import StorageType from '@storage/enum/storage-type';
import MaterialEntity from '@section/models/material.model';
import VideoEntity from '@section/models/video.model';
import UserEntity from '@user/models/user.model';

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

  @Column({ type: 'boolean' })
  @Exclude()
  isAvailable: boolean;

  @ManyToOne(() => UserEntity, (admin) => admin.files)
  @JoinColumn({ name: 'admin_id' })
  admin: Promise<UserEntity>;

  @OneToOne(() => CourseEntity, (course) => course.thumbnail, {
    nullable: true,
  })
  course: Promise<CourseEntity>;

  @OneToOne(() => MaterialEntity, (material) => material.file, {
    nullable: true,
  })
  material: Promise<MaterialEntity>;

  @OneToOne(() => VideoEntity, (video) => video.file, { nullable: true })
  video: Promise<VideoEntity>;
}

export default FileEntity;
