import { Column, Entity } from 'typeorm';
import { Exclude } from 'class-transformer';
import Base from '@database/models/base';
import ExtensionType from '@jobs/enum/extension-type';
import StatusType from '@jobs/enum/status-type';

@Entity('jobs')
class JobsEntity extends Base {
  @Column({
    type: 'enum',
    enum: ExtensionType,
  })
  extension: ExtensionType;

  @Column({ type: 'text', nullable: true })
  output: string;

  @Column({ type: 'timestamp', nullable: true })
  @Exclude()
  startAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  @Exclude()
  endAt: Date;

  @Column({
    type: 'enum',
    enum: StatusType,
    default: StatusType.PENDING,
  })
  status: StatusType;
}

export default JobsEntity;
