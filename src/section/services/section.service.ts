import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository, TreeRepository } from 'typeorm';
import CloudLogger from '@logger/class/cloud-logger';
import FileService from '@file/services/file.service';
import SectionEntity from '@section/models/section.model';
import CourseEntity from '@course/models/course.model';
import StorageType from '@storage/enum/storage-type';

@Injectable()
class SectionService {
  constructor(
    private readonly cloudLogger: CloudLogger,
    private readonly fileService: FileService,
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
    @InjectRepository(SectionEntity)
    private readonly sectionRepository: TreeRepository<SectionEntity>,
  ) {}

  async getSectionByCourse(
    courseId: number,
    studentId: number,
  ): Promise<SectionEntity> {
    const course = await this.courseRepository.findOne({
      where: { id: courseId, subscribers: { id: studentId } },
    });

    const parentSection = await course.parentSection;
    const childrenSection = await this.sectionRepository.findDescendantsTree(
      parentSection,
    );

    return childrenSection;
  }

  async searchSectionsByTitle(
    courseId: number,
    title: string,
    studentId: number,
  ): Promise<SectionEntity[]> {
    const course = await this.courseRepository.findOne({
      where: { id: courseId, subscribers: { id: studentId } },
    });

    const parentSection = await course.parentSection;
    const childrenSections = await this.sectionRepository
      .createDescendantsQueryBuilder(
        'section',
        'section_closure',
        parentSection,
      )
      .andWhere({ title: title ? ILike(`%${title}%`) : undefined })
      .cache(true)
      .getMany();

    return childrenSections;
  }

  async create(
    title: string,
    objective: string,
    duration: number,
    parentId: number,
    courseId: number,
    adminId: number,
    isAncestor: boolean,
    content: Express.Multer.File,
  ): Promise<SectionEntity> {
    const section = new SectionEntity();
    section.title = title;
    section.objective = objective;
    section.duration = duration;

    const parent = await this.sectionRepository.findOne({
      where: { id: parentId },
    });
    section.parent = Promise.resolve(parent);

    const course = await this.courseRepository.findOne({
      where: { id: courseId, admin: { id: adminId } },
    });
    section.adjoinedCourse = isAncestor ? Promise.resolve(course) : undefined;

    const file = await this.fileService.create(
      adminId,
      StorageType.HTML,
      content,
    );
    section.file = Promise.resolve(file);

    return await this.sectionRepository.save(section);
  }

  async edit(
    id: number,
    title: string,
    objective: string,
    duration: number,
    parentId: number,
    courseId: number,
    adminId: number,
    isAncestor: boolean,
    content: Express.Multer.File,
  ): Promise<SectionEntity> {
    const section = await this.sectionRepository.findOne({
      where: { id },
    });
    section.title = title;
    section.objective = objective;
    section.duration = duration;

    const parent = await this.sectionRepository.findOne({
      where: { id: parentId },
    });
    section.parent = Promise.resolve(parent);

    const course = await this.courseRepository.findOne({
      where: { id: courseId, admin: { id: adminId } },
    });
    section.adjoinedCourse = isAncestor ? Promise.resolve(course) : undefined;

    if (content) {
      const file = await section.file;

      if (file) {
        const editedFile = await this.fileService.edit(
          file.id,
          adminId,
          StorageType.HTML,
          content,
        );
        section.file = Promise.resolve(editedFile);
      } else {
        const newFile = await this.fileService.create(
          adminId,
          StorageType.HTML,
          content,
        );
        section.file = Promise.resolve(newFile);
      }
    }

    return await this.sectionRepository.save(section);
  }

  async delete(id: number, adminId: number): Promise<SectionEntity> {
    const section = await this.sectionRepository.findOne({
      where: { id },
    });
    const file = await section.file;

    if (file) {
      await this.fileService.delete(file.id, adminId, StorageType.HTML);
    }

    return await this.sectionRepository.softRemove(section);
  }
}

export default SectionService;
