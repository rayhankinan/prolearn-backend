import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import CloudLogger from '@logger/class/cloud-logger';
import MaterialEntity from '@section/models/material.model';
import CourseEntity from '@course/models/course.model';
import SectionEntity from '@section/models/section.model';
import StorageService from '@storage/services/storage.service';
import StorageType from '@storage/enum/storage-type';

@Injectable()
class MaterialService {
  constructor(
    private readonly cloudLogger: CloudLogger,
    private readonly storageService: StorageService,
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

    const uuid = uuidv4();
    await this.storageService.upload(
      uuid,
      StorageType.MARKDOWN,
      content,
    ); /* TO DO: Masukkan ini ke queue */
    material.uuid = uuid;

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

    /* Soft Deletion in Object Storage */
    await this.storageService.delete(
      material.uuid,
      StorageType.MARKDOWN,
    ); /* TO DO: Masukkan ini ke queue */

    const uuid = uuidv4();
    await this.storageService.upload(
      uuid,
      StorageType.MARKDOWN,
      content,
    ); /* TO DO: Masukkan ini ke queue */
    material.uuid = uuid;

    return await this.materialRepository.save(material);
  }

  async delete(id: number, adminId: number): Promise<MaterialEntity> {
    /* TO DO: Cek adminId */
    const material = await this.materialRepository.findOne({
      where: { id },
    });

    /* Soft Deletion in Object Storage */
    await this.storageService.delete(
      material.uuid,
      StorageType.MARKDOWN,
    ); /* TO DO: Masukkan ini ke queue */

    return await this.materialRepository.softRemove(material);
  }
}

export default MaterialService;
