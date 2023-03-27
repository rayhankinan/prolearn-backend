import { Column, Entity } from 'typeorm';
import Base from '@database/models/base';
import EXTENSION from '@jobs/enum/extension.enum';
import STATUS from '@jobs/enum/status.enum';
import { Exclude } from 'class-transformer';

@Entity('jobs')
class JobsEntity extends Base {
  @Column({
    type: 'enum',
    enum: EXTENSION,
  })
  extension: EXTENSION;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Exclude()
  inputPath: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  output: string;

  @Column({ type: 'varchar', length: 255 })
  @Exclude()
  codePath: string;

  @Column({ type: 'timestamp', nullable: true })
  @Exclude()
  startAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  @Exclude()
  endAt: Date;

  @Column({
    type: 'enum',
    enum: STATUS,
    default: STATUS.PENDING,
  })
  status: STATUS;
}

export default JobsEntity;
