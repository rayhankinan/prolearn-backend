// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import CloudLogger from '@logger/class/cloud-logger';
// import SectionEntity from '@section/models/section.model';
// import MaterialEntity from '@section/models/material.model';
// import CreateSectionDto from '@section/dto/create-section';
// import DeleteSectionDto from '@section/dto/delete-section';
// import UpdateSectionDto from '@section/dto/update-section';

// @Injectable()
// export default class SectionService {
//   constructor(
//     @InjectRepository(SectionEntity)
//     private readonly sectionRepository: Repository<SectionEntity>,
//     @InjectRepository(MaterialEntity)
//     private readonly materialRepository: Repository<MaterialEntity>,
//   ) {}

//   async createMaterial(createSectionDto: CreateSectionDto): Promise<MaterialEntity> {
//     const { title, objective, duration, type, linkToMarkdown, parent } = createSectionDto;
//     const section = new MaterialEntity();
//     section.title = title;
//     section.objective = objective;
//     section.duration = duration;
//     section.type = type;
//     section.linkToMarkdown = linkToMarkdown;
    
//     const material = await this.sectionRepository.save(section);
//     // TO DO: add parent
//     return material;
//   }





//   async getSection(id: number): Promise<SectionEntity> {
//     const course = await this.sectionRepository.findOne({
//       where: { id },
//     });

//     return course;
//   }
// }