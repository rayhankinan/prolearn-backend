import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import Base from '@database/models/base';
import SectionType from '@section/enum/section-type';
import CourseEntity from '@course/models/course.model';
import FileEntity from '@file/models/file.model';
import QuizEntity from '@quiz/models/quiz.model';

@Entity('section')
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

  @Column({ type: 'bigint', default: 1 })
  level: number;

  @OneToOne(() => FileEntity, (file) => file.section, { nullable: true })
  @JoinColumn({ name: 'file_id' })
  file?: Promise<FileEntity>;

  @OneToOne(() => QuizEntity, (quiz) => quiz.section, { nullable: true })
  @JoinColumn({ name: 'quiz_id' })
  quiz?: Promise<QuizEntity>;

  @ManyToOne(() => CourseEntity, (course) => course.sections)
  courses: Promise<CourseEntity>;
}

export default SectionEntity;
