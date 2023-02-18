import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CloudLogger from '@logger/class/cloud-logger';
import SectionEntity from '@section/models/section.model';

@Injectable()
class SectionService {
  constructor(
    public readonly cloudLogger: CloudLogger,
    @InjectRepository(SectionEntity)
    private readonly sectionRepository: Repository<SectionEntity>,
  ) {}

  async getSectionById(id: number): Promise<SectionEntity> {
    const course = await this.sectionRepository.findOne({
      where: { id },
    });

    return course;
  }
}

export default SectionService;
