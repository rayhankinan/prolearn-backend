import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import Base from '@database/models/base';
import SectionType from '@section/enum/section-type';
import CourseEntity from '@course/models/course.model';
import FileEntity from '@file/models/file.model';
import QuizEntity from '@quiz/models/quiz.model';

@Entity('section')
@Tree('closure-table', { closureTableName: 'section_closure' })
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

  @OneToOne(() => FileEntity, (file) => file.section, { nullable: true })
  @JoinColumn({ name: 'file_id' })
  file?: Promise<FileEntity>;

  @OneToOne(() => CourseEntity, (course) => course.parentSection, {
    nullable: true,
  })
  adjoinedCourse?: Promise<CourseEntity>;

  @OneToOne(() => QuizEntity, (quiz) => quiz.section, { nullable: true })
  quiz?: Promise<QuizEntity>;

  @TreeChildren()
  children: Promise<SectionEntity[]>;

  @TreeParent()
  parent: Promise<SectionEntity>;
}

export default SectionEntity;
