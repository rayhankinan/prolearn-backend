import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToMany,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('material')
export class MaterialEntity {}
