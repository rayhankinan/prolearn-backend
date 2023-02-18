import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import CloudLogger from '@logger/class/cloud-logger';
import CourseEntity from '@course/models/course.model';
import CourseRO from '@course/interface/fetch-course.interface';
import CreateCourseDto from '@course/dto/create-course';
import DeleteCourseDto from '@course/dto/delete-course';
import UpdateCourseDto from '@course/dto/update-course';
import FetchCourseDto from '@course/dto/fetch-course';
import CategoryEntity from '@category/models/category.model';

@Injectable()
class CourseService {
  constructor(
    private readonly cloudLogger: CloudLogger,
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
  ) {
    this.cloudLogger = new CloudLogger(CourseEntity.name);
  }

  async fetchCourse(query: FetchCourseDto): Promise<CourseRO> {
    const [courses, totalCourse] = await Promise.all([
      this.courseRepository.find({
        relations: {
          categories: true,
        },
        where: {
          categories: {
            id: query.categoryId,
          },
          title: ILike(`%${query.title}%`),
          difficulty: query.difficulty,
        },
        order: {
          createdAt: 'DESC',
        },
        take: query.limit,
        skip: (query.page - 1) * query.limit,
      }),
      this.courseRepository.count(),
    ]);

    const totalPage = query.limit ? Math.ceil(totalCourse / query.limit) : 1;
    const currentPage = query.page ? query.page : 1;
    const coursesCount = courses.length;

    return { courses, coursesCount, currentPage, totalPage };
  }

  async getCourseById(id: number): Promise<CourseEntity> {
    const course = await this.courseRepository.findOne({
      where: { id },
    });

    return course;
  }

  async getCourseByTitle(title: string): Promise<CourseEntity> {
    const course = await this.courseRepository.findOne({
      where: { title },
    });

    return course;
  }

  async delete(request: DeleteCourseDto): Promise<CourseEntity> {
    const { id } = request;

    const category = await this.courseRepository.findOne({
      where: { id },
    });

    return await this.courseRepository.softRemove(category);
  }

  async create(
    request: CreateCourseDto,
    categories: CategoryEntity[],
  ): Promise<CourseEntity> {
    const { title, description, difficulty, status } = request;

    const course = new CourseEntity();
    course.title = title;
    course.description = description;
    course.difficulty = difficulty;
    course.status = status;
    course.categories = Promise.resolve(categories);

    return await this.courseRepository.save(course);
  }

  async update(
    id: number,
    request: UpdateCourseDto,
    categories: CategoryEntity[],
  ): Promise<CourseEntity> {
    const { title, description, difficulty, status } = request;

    const course = await this.courseRepository.findOne({
      where: { id },
    });

    course.title = title;
    course.description = description;
    course.difficulty = difficulty;
    course.status = status;
    course.categories = Promise.resolve(categories);

    return await this.courseRepository.save(course);
  }
}

export default CourseService;
