import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import Base from '@database/models/base';
import FileType from '@file/enum/file-type';
import AdminEntity from '@user/models/admin.model';

@Entity('file')
class FileEntity extends Base {
  @Column({ type: 'enum', enum: FileType })
  type: FileType;

  @Column({ type: 'varchar', length: 255 })
  linkToFile: string;

  @ManyToOne(() => AdminEntity, (admin) => admin.files)
  @JoinColumn({ name: 'admin_id' })
  admin: Promise<AdminEntity>;
}

export default FileEntity;
