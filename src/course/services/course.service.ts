import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import CloudLogger from '@logger/class/cloud-logger';
import CourseEntity from '@course/models/course.model';
import CourseRO from '@course/interface/fetch-course.interface';
import CategoryEntity from '@category/models/category.model';
import CourseLevel from '@course/enum/course-level';
import CourseStatus from '@course/enum/course-status';
import AdminEntity from '@user/models/admin.model';

@Injectable()
class CourseService {
  constructor(
    private readonly cloudLogger: CloudLogger,
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
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
    adminId: number,
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
          admin: {
            id: adminId,
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

  async getCourseById(id: number, adminId: number): Promise<CourseEntity> {
    const course = await this.courseRepository.findOne({
      where: { id, admin: { id: adminId } },
    });

    return course;
  }

  async create(
    title: string,
    description: string,
    difficulty: CourseLevel,
    status: CourseStatus,
    categoryIds: number[],
    adminId: number,
  ): Promise<CourseEntity> {
    const course = new CourseEntity();
    course.title = title;
    course.description = description;
    course.difficulty = difficulty;
    course.status = status;

    const categories = await this.categoryRepository.find({
      where: { id: In(categoryIds) },
    });
    course.categories = Promise.resolve(categories);

    const admin = await this.adminRepository.findOne({
      where: { id: adminId },
    });
    course.admin = Promise.resolve(admin);

    return await this.courseRepository.save(course);
  }

  async update(
    id: number,
    title: string,
    description: string,
    difficulty: CourseLevel,
    status: CourseStatus,
    categoryIDs: number[],
    adminId: number,
  ): Promise<CourseEntity> {
    const course = await this.courseRepository.findOne({
      where: { id, admin: { id: adminId } },
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

  async delete(id: number, adminId: number): Promise<CourseEntity> {
    const category = await this.courseRepository.findOne({
      where: { id, admin: { id: adminId } },
    });

    return await this.courseRepository.softRemove(category);
  }
}

export default CourseService;
