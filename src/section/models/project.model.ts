import { ChildEntity, Column } from 'typeorm';
import SectionEntity from '@section/models/section.model';
import SectionType from '@section/enum/section-type';

@ChildEntity('project')
class ProjectEntity extends SectionEntity {
  @Column({ type: 'enum', enum: SectionType, default: SectionType.PROJECT })
  readonly type: SectionType;
}

export default ProjectEntity;
