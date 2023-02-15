import { ChildEntity, Column } from 'typeorm';
import SectionEntity from '@section/models/section.model';
import SectionType from '@section/enum/section-type';

@ChildEntity('material')
class MaterialEntity extends SectionEntity {
  @Column({ type: 'enum', enum: SectionType, default: SectionType.MATERIAL })
  readonly type: SectionType;

  @Column({ type: 'varchar', length: 255 })
  linkToMarkdown: string;
}

export default MaterialEntity;
