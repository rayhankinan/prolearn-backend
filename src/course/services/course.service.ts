import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import CloudLogger from '@logger/class/cloud-logger';
import CourseEntity from '@course/models/course.model';
import { CourseRO } from '@course/interface/fetch-course.interface';

@Injectable()
class CourseService {
  constructor(
    private readonly cloudLogger: CloudLogger,
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
  ) {
    this.cloudLogger = new CloudLogger(CourseEntity.name);
  }

  async fetchCourse(query): Promise<CourseRO> {
    const relation = this.courseRepository
    .createQueryBuilder('course')
    .leftJoinAndSelect('course.id', 'course_category')
    .leftJoinAndSelect('course_category.categoryId', 'category')

    if (query.category) {
      relation.andWhere('category.title = :title', { title: query.category });
    }
    if (query.title) {
      relation.andWhere('course.title = :title', { title: query.title });
    }
    if (query.difficulty) {
      relation.andWhere('course.difficulty = :difficulty', { difficulty: query.difficulty });
    }

    relation.orderBy('course.createdAt', 'DESC');

    const coursesCount = await relation.getCount();

    if (query.limit) {
      relation.limit(query.limit);
    }
    if (query.offset) {
      relation.offset(query.offset);
    }

    const courses = await relation.getMany();

    return {courses, coursesCount};
  }

  async fetchCourseById(id: number): Promise<CourseEntity> {
    const course = await this.courseRepository.findOne({
      where: { id },
    });

    return course;
  }

}