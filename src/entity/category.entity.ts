import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { CourseEntity } from './course.entity';

@Entity('category')
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, default: 'No Title' })
  title: string;

  @ManyToMany(() => CourseEntity, (course) => course.categories)
  courses?: CourseEntity[];
}
