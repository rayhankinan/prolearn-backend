import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, In, Repository } from 'typeorm';
import CategoryEntity from '@category/models/category.model';
import CourseEntity from '@course/models/course.model';
import CourseLevel from '@course/enum/course-level';
import CourseStatus from '@course/enum/course-status';
import CloudLogger from '@logger/class/cloud-logger';
import StorageType from '@storage/enum/storage-type';
import AdminEntity from '@user/models/admin.model';
import FileService from '@file/services/file.service';

@Injectable()
class CourseService {
  constructor(
    private readonly cloudLogger: CloudLogger,
    private readonly fileService: FileService,
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
  ) {
    this.cloudLogger = new CloudLogger(CourseEntity.name);
  }

  async fetchCourse(
    categoryId: number[],
    title: string,
    difficulty: CourseLevel,
    limit: number,
    page: number,
    subscribed: boolean,
    adminId: number,
    studentId: number,
  ): Promise<{
    courses: CourseEntity[];
    count: number;
    currentPage: number;
    totalPage: number;
  }> {
    const condition: FindOptionsWhere<CourseEntity> = {
      admin: {
        id: adminId,
      },
      title: title ? ILike(`%${title}%`) : undefined,
      difficulty,
      categories: { id: categoryId ? In(categoryId) : undefined },
      subscribers: subscribed ? { id: studentId } : undefined,
    };

    const [courses, total] = await Promise.all([
      this.courseRepository.find({
        relations: {
          categories: true,
          thumbnail: true,
          subscribers: subscribed,
        },
        where: condition,
        order: {
          createdAt: 'DESC',
        },
        take: limit,
        skip: (page - 1) * limit,
        cache: true,
      }),
      this.courseRepository.count({
        where: condition,
        cache: true,
      }),
    ]);

    const count = courses.length;
    const currentPage = page;
    const totalPage = Math.ceil(total / limit);

    return { courses, count, currentPage, totalPage };
  }

  async getCourseById(id: number, adminId: number): Promise<CourseEntity> {
    const course = await this.courseRepository.findOne({
      where: { id, admin: { id: adminId } },
      relations: { categories: true, thumbnail: true },
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
    content?: Express.Multer.File,
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

    if (content) {
      const savedFile = await this.fileService.create(
        adminId,
        StorageType.FILE,
        content,
      );

      course.thumbnail = Promise.resolve(savedFile);
    }

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

    const categories = await this.categoryRepository.find({
      where: { id: In(categoryIDs) },
    });
    course.categories = Promise.resolve(categories);

    if (content) {
      const thumbnail = await course.thumbnail;

      if (thumbnail) {
        const editedFile = await this.fileService.edit(
          thumbnail.id,
          adminId,
          StorageType.FILE,
          content,
        );
        course.thumbnail = Promise.resolve(editedFile);
      } else {
        const newFile = await this.fileService.create(
          adminId,
          StorageType.FILE,
          content,
        );
        course.thumbnail = Promise.resolve(newFile);
      }
    }

    return await this.courseRepository.save(course);
  }

  async delete(id: number, adminId: number): Promise<CourseEntity> {
    const course = await this.courseRepository.findOne({
      where: { id, admin: { id: adminId } },
    });
    const thumbnail = await course.thumbnail;

    if (thumbnail) {
      await this.fileService.delete(thumbnail.id, adminId, StorageType.FILE);
    }

    return await this.courseRepository.softRemove(course);
  }
}

export default CourseService;
