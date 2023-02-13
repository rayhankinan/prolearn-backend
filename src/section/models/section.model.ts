import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  TableInheritance,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import Base from '@common/models/base';
import CourseEntity from '@course/models/course.model';

@Entity('section')
@Tree('closure-table')
@TableInheritance({ column: 'type' })
class SectionEntity extends Base {
  @Column({ type: 'varchar', length: '255', default: 'No Title' })
  @Index({ fulltext: true })
  title: string;

  @Column({ nullable: true, type: 'text' })
  objective: string;

  @Column()
  duration: number;

  @ManyToOne(() => CourseEntity, (course) => course.sections)
  @JoinColumn({ name: 'courseId' })
  course: Promise<CourseEntity>;

  @TreeChildren()
  children: Promise<SectionEntity[]>;

  @TreeParent()
  parent: Promise<SectionEntity>;
}

export default SectionEntity;
