import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import CategoryEntity from '@category/models/category.model';
import CourseEntity from '@course/models/course.model';
import CourseLevel from '@course/enum/course-level';
import CourseStatus from '@course/enum/course-status';
import CloudLogger from '@logger/class/cloud-logger';
import StorageService from '@storage/services/storage.service';
import StorageType from '@storage/enum/storage-type';
import AdminEntity from '@user/models/admin.model';

@Injectable()
class CourseService {
  constructor(
    private readonly cloudLogger: CloudLogger,
    private readonly storageService: StorageService,
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
  ): Promise<{
    courses: CourseEntity[];
    count: number;
    currentPage: number;
    totalPage: number;
  }> {
    const [courses, total] = await Promise.all([
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

    const count = courses.length;
    const currentPage = page ? page : 1;
    const totalPage = limit ? Math.ceil(total / limit) : 1;

    return { courses, count, currentPage, totalPage };
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
    content?: Express.Multer.File
  ): Promise<CourseEntity> {
    const course = new CourseEntity();
    course.title = title;
    course.description = description;
    course.difficulty = difficulty;
    course.status = status;

    if (content) {
      const uuid = uuidv4();
      await this.storageService.upload(uuid, StorageType.IMAGE, content);
      course.thumbnail = uuid;
    }

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
    content?: Express.Multer.File,
  ): Promise<CourseEntity> {
    const course = await this.courseRepository.findOne({
      where: { id, admin: { id: adminId } },
    });

    course.title = title;
    course.description = description;
    course.difficulty = difficulty;
    course.status = status;

    if (course.thumbnail) {
      await this.storageService.delete(course.thumbnail, StorageType.IMAGE);
    }
    if (content) {
      const uuid = uuidv4();
      await this.storageService.upload(uuid, StorageType.IMAGE, content);
      course.thumbnail = uuid;
    }
  
    const categories = await this.categoryRepository.find({
      where: { id: In(categoryIDs) },
    });
    course.categories = Promise.resolve(categories);

    return await this.courseRepository.save(course);
  }

  async delete(id: number, adminId: number): Promise<CourseEntity> {
    const course = await this.courseRepository.findOne({
      where: { id, admin: { id: adminId } },
    });
    console.log(course);
    if (course.thumbnail) {
      await this.storageService.delete(course.thumbnail, StorageType.IMAGE);
    }

    return await this.courseRepository.softRemove(course);
  }
}

export default CourseService;
