import { ChildEntity, Column, JoinColumn, OneToOne } from 'typeorm';
import SectionEntity from '@section/models/section.model';
import SectionType from '@section/enum/section-type';
import FileEntity from '@file/models/file.model';

@ChildEntity('video')
class VideoEntity extends SectionEntity {
  @Column({ type: 'enum', enum: SectionType, default: SectionType.VIDEO })
  type: SectionType;

  @OneToOne(() => FileEntity, (file) => file.video, { nullable: true })
  @JoinColumn({ name: 'file_id' })
  file: Promise<FileEntity>;
}

export default VideoEntity;
