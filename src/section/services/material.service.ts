import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm';
import CloudLogger from '@logger/class/cloud-logger';
import MaterialEntity from '@section/models/material.model';
import CourseEntity from '@course/models/course.model';
import SectionEntity from '@section/models/section.model';
import StorageType from '@storage/enum/storage-type';
import FileService from '@file/services/file.service';

@Injectable()
class MaterialService {
  constructor(
    private readonly cloudLogger: CloudLogger,
    private readonly fileService: FileService,
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
    @InjectRepository(SectionEntity)
    private readonly sectionRepository: TreeRepository<SectionEntity>,
    @InjectRepository(MaterialEntity)
    private readonly materialRepository: Repository<MaterialEntity>,
  ) {}

  async render(materialId: number): Promise<Buffer> {
    const material = await this.materialRepository.findOne({
      where: { id: materialId },
    });

    const file = await material.file;
    const [buffer] = await this.fileService.render(
      file.id,
      StorageType.MARKDOWN,
    );

    return buffer;
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
  ): Promise<MaterialEntity> {
    const material = new MaterialEntity();
    material.title = title;
    material.objective = objective;
    material.duration = duration;

    const parent = await this.sectionRepository.findOne({
      where: { id: parentId },
    });
    material.parent = Promise.resolve(parent);

    const course = await this.courseRepository.findOne({
      where: { id: courseId, admin: { id: adminId } },
    });
    material.adjoinedCourse = isAncestor ? Promise.resolve(course) : undefined;

    const file = await this.fileService.create(
      adminId,
      StorageType.MARKDOWN,
      content,
    );
    material.file = Promise.resolve(file);

    return await this.materialRepository.save(material);
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
  ): Promise<MaterialEntity> {
    const material = await this.materialRepository.findOne({
      where: { id },
    });
    material.title = title;
    material.objective = objective;
    material.duration = duration;

    const parent = await this.sectionRepository.findOne({
      where: { id: parentId },
    });
    material.parent = Promise.resolve(parent);

    const course = await this.courseRepository.findOne({
      where: { id: courseId, admin: { id: adminId } },
    });
    material.adjoinedCourse = isAncestor ? Promise.resolve(course) : undefined;

    if (content) {
      const file = await material.file;

      if (file) {
        const editedFile = await this.fileService.edit(
          file.id,
          adminId,
          StorageType.MARKDOWN,
          content,
        );
        material.file = Promise.resolve(editedFile);
      } else {
        const newFile = await this.fileService.create(
          adminId,
          StorageType.MARKDOWN,
          content,
        );
        material.file = Promise.resolve(newFile);
      }
    }

    return await this.materialRepository.save(material);
  }

  async delete(id: number, adminId: number): Promise<MaterialEntity> {
    const material = await this.materialRepository.findOne({
      where: { id },
    });
    const file = await material.file;

    if (file) {
      await this.fileService.delete(file.id, adminId, StorageType.MARKDOWN);
    }

    return await this.materialRepository.softRemove(material);
  }
}

export default MaterialService;
