import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import CloudLogger from '@logger/class/cloud-logger';
import CourseEntity from '@course/models/course.model';
import CourseRO from '@course/interface/fetch-course.interface';
import CreateCourseDto from '@course/dto/create-course';
import UpdateCourseContentDto from '@course/dto/update-course-content';
import CategoryEntity from '@category/models/category.model';
import CourseLevel from '@course/enum/course-level';
import CourseStatus from '@course/enum/course-status';

@Injectable()
class CourseService {
  constructor(
    private readonly cloudLogger: CloudLogger,
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {
    this.cloudLogger = new CloudLogger(CourseEntity.name);
  }

  async fetchCourse(
    categoryId: number,
    title: string,
    difficulty: CourseLevel,
    limit: number,
    page: number,
  ): Promise<CourseRO> {
    const [courses, totalCourse] = await Promise.all([
      this.courseRepository.find({
        relations: {
          categories: true,
        },
        where: {
          categories: {
            id: categoryId,
          },
          title: ILike(`%${title}%`),
          difficulty,
        },
        order: {
          createdAt: 'DESC',
        },
        take: limit,
        skip: (page - 1) * limit,
      }),
      this.courseRepository.count(),
    ]);

    const totalPage = limit ? Math.ceil(totalCourse / limit) : 1;
    const currentPage = page ? page : 1;
    const coursesCount = courses.length;

    return { courses, coursesCount, currentPage, totalPage };
  }

  async getCourseById(id: number): Promise<CourseEntity> {
    const course = await this.courseRepository.findOne({
      where: { id },
    });

    return course;
  }

  async delete(id: number): Promise<CourseEntity> {
    const category = await this.courseRepository.findOne({
      where: { id },
    });

    return await this.courseRepository.softRemove(category);
  }

  async create(
    title: string,
    description: string,
    difficulty: CourseLevel,
    categoryIDs: number[],
    status: CourseStatus,
  ): Promise<CourseEntity> {
    const course = new CourseEntity();
    course.title = title;
    course.description = description;
    course.difficulty = difficulty;
    course.status = status;

    const categories = await this.categoryRepository.find({
      where: { id: In(categoryIDs) },
    });
    course.categories = Promise.resolve(categories);

    return await this.courseRepository.save(course);
  }

  async update(
    id: number,
    title: string,
    description: string,
    difficulty: CourseLevel,
    categoryIDs: number[],
    status: CourseStatus,
  ): Promise<CourseEntity> {
    const course = await this.courseRepository.findOne({
      where: { id },
    });

    course.title = title;
    course.description = description;
    course.difficulty = difficulty;
    course.status = status;

    const categories = await this.categoryRepository.find({
      where: { id: In(categoryIDs) },
    });
    course.categories = Promise.resolve(categories);

    return await this.courseRepository.save(course);
  }
}

export default CourseService;
