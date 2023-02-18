import { ChildEntity, Column } from 'typeorm';
import SectionEntity from '@section/models/section.model';
import SectionType from '@section/enum/section-type';

@ChildEntity('material')
class MaterialEntity extends SectionEntity {
  @Column({ type: 'enum', enum: SectionType, default: SectionType.MATERIAL })
  type: SectionType;

  @Column({ type: 'uuid' })
  uuid: string;
}

export default MaterialEntity;
