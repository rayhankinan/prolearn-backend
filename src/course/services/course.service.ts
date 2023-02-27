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
import FileEntity from '@file/models/file.model';

@Injectable()
class CourseService {
  constructor(
    private readonly cloudLogger: CloudLogger,
    private readonly storageService: StorageService,
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
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
    var condition = {
      categories: {
        id: categoryId,
      },
      admin: {
        id: adminId,
      },
      title: ILike(`%${title ? title : ''}%`),
      difficulty,
    }
    const [courses, total] = await Promise.all([
      this.courseRepository.find({
        relations: {
          categories: true,
          thumbnail: true,
        },
        where: condition,
        order: {
          createdAt: 'DESC',
        },
        take: limit,
        skip: (page - 1) * limit,
      }),
      this.courseRepository.count(condition),
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
      const file = new FileEntity();
      file.name = content.originalname;
      file.mimetype = content.mimetype;

      const uuid = uuidv4();
      await this.storageService.upload(
        uuid,
        StorageType.FILE,
        content,
      ); /* TO DO: Masukkan ini ke queue */
      file.uuid = uuid;

      const admin = await this.adminRepository.findOne({
        where: { id: adminId },
      });
      file.admin = Promise.resolve(admin);

      const savedFile = await this.fileRepository.save(file);
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
      const file = await this.fileRepository.findOne({
        where: { id, admin: { id: adminId } },
      });
      file.name = content.originalname;
      file.mimetype = content.mimetype;

      /* Soft Deletion in Object Storage */
      await this.storageService.delete(
        file.uuid,
        StorageType.FILE,
      ); /* TO DO: Masukkan ini ke queue */

      const uuid = uuidv4();
      await this.storageService.upload(
        uuid,
        StorageType.FILE,
        content,
      ); /* TO DO: Masukkan ini ke queue */
      file.uuid = uuid;

      const admin = await this.adminRepository.findOne({
        where: { id: adminId },
      });
      file.admin = Promise.resolve(admin);

      const savedFile = await this.fileRepository.save(file);
      course.thumbnail = Promise.resolve(savedFile);
    }

    return await this.courseRepository.save(course);
  }

  async delete(id: number, adminId: number): Promise<CourseEntity> {
    const course = await this.courseRepository.findOne({
      where: { id, admin: { id: adminId } },
    });
    const thumbnail = await course.thumbnail;

    if (thumbnail) {
      /* Soft Deletion in Object Storage */
      await this.storageService.delete(
        thumbnail.uuid,
        StorageType.FILE,
      ); /* TO DO: Masukkan ini ke queue */
    }

    return await this.courseRepository.softRemove(course);
  }
}

export default CourseService;
