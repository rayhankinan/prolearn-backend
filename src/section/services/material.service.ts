import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CloudLogger from '@logger/class/cloud-logger';
import MaterialEntity from '@section/models/material.model';
import CreateMaterialDto from '@section/dto/create-material';
import SectionService from '@section/services/section.service';

@Injectable()
class MaterialService {
  constructor(
    private readonly cloudLogger: CloudLogger,
    private readonly sectionService: SectionService,
    @InjectRepository(MaterialEntity)
    private readonly materialRepository: Repository<MaterialEntity>,
  ) {}

  async create(createMaterialDto: CreateMaterialDto): Promise<MaterialEntity> {
    const { title, objective, duration, markdown, parentId } =
      createMaterialDto;

    const material = new MaterialEntity();
    material.title = title;
    material.objective = objective;
    material.duration = duration;

    /* TO DO: Integrasikan service storage */
    material.linkToMarkdown = null;

    const parent = await this.sectionService.getSectionById(parentId);
    material.parent = Promise.resolve(parent);

    return await this.materialRepository.save(material);
  }
}
