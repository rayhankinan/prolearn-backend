import { ChildEntity, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import SectionEntity from '@section/models/section.model';
import SectionType from '@section/enum/section-type';

@ChildEntity('material')
class MaterialEntity extends SectionEntity {
  @Column({ type: 'enum', enum: SectionType, default: SectionType.MATERIAL })
  type: SectionType;

  @Column({ type: 'uuid' })
  @Exclude()
  uuid: string;
}

export default MaterialEntity;
