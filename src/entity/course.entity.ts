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
import { CategoryEntity } from './category.entity';
import { QuizEntity } from './section/quiz.entity';
import { MaterialEntity } from './section/material.entity';
import { ProjectEntity } from './section/project.entity';
import { CourseLevel, SectionType, StatusCourse } from '../common/types';

@Entity('course')
export class CourseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, default: 'No Title' })
  title: string;

  @Column({ nullable: false, default: '' })
  description: string;

  @Column({ nullable: false, default: CourseLevel.BEGINNER })
  difficulty: CourseLevel;

  @Column({ nullable: false, default: StatusCourse.DRAFT })
  status: StatusCourse;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated: Date;

  @OneToMany(() => SectionEntity, (section) => section.course)
  sections?: SectionEntity[];

  @ManyToMany(() => CategoryEntity, (category) => category.courses)
  categories?: CategoryEntity[];
}

@Entity('section')
export class SectionEntity {
  @Column({ nullable: false })
  title: string;

  @Column()
  objective: string;

  @Column()
  duration: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated: Date;

  @ManyToOne(() => CourseEntity, (course) => course.sections)
  course: CourseEntity;

  @Column()
  type: SectionType;
}
