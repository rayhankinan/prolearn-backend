import { ChildEntity, Column, JoinColumn, OneToOne } from 'typeorm';
import SectionEntity from '@section/models/section.model';
import SectionType from '@section/enum/section-type';
import FileEntity from '@file/models/file.model';

@ChildEntity('material')
class MaterialEntity extends SectionEntity {
  @Column({ type: 'enum', enum: SectionType, default: SectionType.MATERIAL })
  type: SectionType;

  @OneToOne(() => FileEntity, (file) => file.material, { nullable: true })
  @JoinColumn({ name: 'file_id' })
  file: Promise<FileEntity>;
}

export default MaterialEntity;
