import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import CloudLogger from '@logger/class/cloud-logger';
import CourseEntity from '@course/models/course.model';
import { CourseRO } from '@course/interface/fetch-course.interface';
import CreateCourseDto from '@course/dto/create-course';
import DeleteCourseDto from '@course/dto/delete-course';
import UpdateCourseDto from '@course/dto/update-course';
import CategoryEntity from '@category/models/category.model';
// import AdminEntity from '@user/models/admin.model';
// import SectionEntity from '@section/models/section.model';

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
    .leftJoinAndSelect('course.categories', 'course_category')

    if (query.category) {
      relation.andWhere('course_category.categoryId = :id', { id: query.category });
    }
    if (query.title) {
      relation.andWhere('course.title ILIKE :title', { title: `%${query.title}%` });
    }
    if (query.difficulty) {
      relation.andWhere('course.difficulty = :difficulty', { difficulty: query.difficulty });
    }

    relation.orderBy('course.createdAt', 'DESC');

    const totalCourse = await relation.getCount();

    if (query.limit) {
      relation.limit(query.limit);
    }
    if (query.page) {
      relation.offset(query.page - 1);
    }

    const courses = await relation.getMany();
    const totalPage = query.limit? Math.ceil(totalCourse / query.limit) : 1;
    const currentPage = query.page? query.page : 1;
    const coursesCount = courses.length;

    return {courses, coursesCount, currentPage, totalPage};
  }

  async fetchCourseById(id: number): Promise<CourseEntity> {

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
    course.categories = categories;

    return await this.courseRepository.save(course);
  }

  async update(id: number, 
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

    return await this.courseRepository.save(course);
  }
}

export default CourseService;