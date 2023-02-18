import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import Base from '@database/models/base';
import AdminEntity from '@user/models/admin.model';
import { Exclude } from 'class-transformer';

@Entity('file')
class FileEntity extends Base {
  @Column({ type: 'varchar', length: 255 })
  @Index({ fulltext: true })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  mimetype: string;

  @Column({ type: 'uuid' })
  @Exclude()
  uuid: string;

  @ManyToOne(() => AdminEntity, (admin) => admin.files)
  @JoinColumn({ name: 'admin_id' })
  admin: Promise<AdminEntity>;
}

export default FileEntity;
