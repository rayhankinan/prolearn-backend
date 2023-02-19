import { ChildEntity, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import SectionEntity from '@section/models/section.model';
import SectionType from '@section/enum/section-type';

@ChildEntity('video')
class VideoEntity extends SectionEntity {
  @Column({ type: 'enum', enum: SectionType, default: SectionType.VIDEO })
  type: SectionType;

  @Column({ type: 'uuid' })
  @Exclude()
  uuid: string;
}

export default VideoEntity;
