import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

abstract class Base {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @CreateDateColumn()
  @Exclude()
  readonly createdAt: Date;

  @UpdateDateColumn()
  @Exclude()
  readonly updatedAt: Date;

  @DeleteDateColumn()
  @Exclude()
  readonly deletedAt: Date;

  @VersionColumn()
  @Exclude()
  readonly version: number;
}

export default Base;
