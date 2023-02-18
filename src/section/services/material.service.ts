import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import CloudLogger from '@logger/class/cloud-logger';
import MaterialEntity from '@section/models/material.model';
import SectionService from '@section/services/section.service';
import StorageService from '@storage/services/storage.service';
import StorageType from '@storage/enum/storage-type';

@Injectable()
class MaterialService {
  constructor(
    private readonly cloudLogger: CloudLogger,
    private readonly storageService: StorageService,
    private readonly sectionService: SectionService,
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

    return downloadResponse[0]; /* Render menggunakan StreamableFile */
  }

  async create(
    title: string,
    objective: string,
    duration: number,
    parentId: number,
    file: Express.Multer.File,
  ): Promise<MaterialEntity> {
    const material = new MaterialEntity();
    material.title = title;
    material.objective = objective;
    material.duration = duration;

    const uuid = uuidv4();
    this.storageService.upload(uuid, StorageType.MARKDOWN, file);
    material.uuid = uuid;

    const parent = await this.sectionService.getSectionById(parentId);
    material.parent = Promise.resolve(parent);

    return await this.materialRepository.save(material);
  }

  async update() {}

  async delete() {}
}

export default MaterialService;
