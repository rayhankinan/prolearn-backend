import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToMany,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import Base from '@common/models/base';
import SectionType from '@section/enum/section-type';

@Entity('section')
class SectionEntity extends Base {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  objective: string;

  @Column()
  duration: number;

  @Column()
  type: SectionType;

  // @ManyToOne(() => CourseEntity, (course) => course.sections)
  // course: CourseEntity;
}

export default SectionEntity;
