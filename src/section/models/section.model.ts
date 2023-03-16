import {
  Column,
  Entity,
  Index,
  OneToOne,
  TableInheritance,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import Base from '@database/models/base';
import CourseEntity from '@course/models/course.model';
import SectionType from '@section/enum/section-type';

@Entity('section')
@Tree('closure-table', { closureTableName: 'section_closure' })
@TableInheritance({ column: 'type' })
class SectionEntity extends Base {
  @Column({ type: 'varchar', length: 255, default: 'No Title' })
  @Index({ fulltext: true })
  title: string;

  @Column({ nullable: true, type: 'text' })
  objective?: string;

  @Column()
  duration: number;

  @Column({ type: 'enum', enum: SectionType })
  type: SectionType;

  @OneToOne(() => CourseEntity, (course) => course.parentSection, {
    nullable: true,
  })
  adjoinedCourse: Promise<CourseEntity>;

  @TreeChildren()
  children: Promise<SectionEntity[]>;

  @TreeParent()
  parent: Promise<SectionEntity>;
}

export default SectionEntity;
