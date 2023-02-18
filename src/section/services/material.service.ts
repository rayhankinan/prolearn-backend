import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import CloudLogger from '@logger/class/cloud-logger';
import MaterialEntity from '@section/models/material.model';
import SectionService from '@section/services/section.service';
import StorageService from '@storage/services/storage.service';
import StorageType from '@storage/enum/storage-type';
import CourseEntity from '@course/models/course.model';

@Injectable()
class MaterialService {
  constructor(
    private readonly cloudLogger: CloudLogger,
    private readonly storageService: StorageService,
    private readonly sectionService: SectionService,
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
    @InjectRepository(MaterialEntity)
    private readonly materialRepository: Repository<MaterialEntity>,
  ) {}

  async render(materialId: number): Promise<Buffer> {
    const material = await this.materialRepository.findOne({
      where: { id: materialId },
    });

    const downloadResponse = await this.storageService.download(
      material.uuid,
      StorageType.MARKDOWN,
    );

    return downloadResponse[0];
  }

  async create(
    title: string,
    objective: string,
    duration: number,
    parentId: number,
    adjoiningCourseId: number,
    content: Express.Multer.File,
  ): Promise<MaterialEntity> {
    const material = new MaterialEntity();
    material.title = title;
    material.objective = objective;
    material.duration = duration;

    const uuid = uuidv4();
    await this.storageService.upload(uuid, StorageType.MARKDOWN, content);
    material.uuid = uuid;

    const parent = await this.sectionService.getSectionById(parentId);
    material.parent = Promise.resolve(parent);

    const adjoinedCourse = await this.courseRepository.findOne({
      where: { id: adjoiningCourseId },
    });
    material.adjoiningCourse = Promise.resolve(adjoinedCourse);

    return await this.materialRepository.save(material);
  }

  async edit(
    id: number,
    title: string,
    objective: string,
    duration: number,
    parentId: number,
    adjoiningCourseId: number,
    content: Express.Multer.File,
  ): Promise<MaterialEntity> {
    const material = await this.materialRepository.findOne({
      where: { id },
    });
    material.title = title;
    material.objective = objective;
    material.duration = duration;

    /* Soft Deletion in Object Storage */
    await this.storageService.delete(material.uuid, StorageType.MARKDOWN);

    const uuid = uuidv4();
    await this.storageService.upload(uuid, StorageType.MARKDOWN, content);
    material.uuid = uuid;

    const parent = await this.sectionService.getSectionById(parentId);
    material.parent = Promise.resolve(parent);

    const adjoinedCourse = await this.courseRepository.findOne({
      where: { id: adjoiningCourseId },
    });
    material.adjoiningCourse = Promise.resolve(adjoinedCourse);

    return await this.materialRepository.save(material);
  }

  async delete(id: number): Promise<MaterialEntity> {
    const material = await this.materialRepository.findOne({
      where: { id },
    });

    /* Soft Deletion in Object Storage */
    await this.storageService.delete(material.uuid, StorageType.MARKDOWN);

    return await this.materialRepository.remove(material);
  }
}

export default MaterialService;
