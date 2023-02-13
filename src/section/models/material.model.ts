import { ChildEntity, Column } from 'typeorm';
import SectionEntity from '@section/models/section.model';
import SectionType from '@section/enum/section-type';

@ChildEntity('material')
class MaterialEntity extends SectionEntity {
  @Column({ type: 'enum', enum: SectionType, default: SectionType.MATERIAL })
  readonly type: SectionType;
}

export default MaterialEntity;
