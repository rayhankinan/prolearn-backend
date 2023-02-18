import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository, TreeRepository } from 'typeorm';
import CloudLogger from '@logger/class/cloud-logger';
import SectionEntity from '@section/models/section.model';
import CourseEntity from '@course/models/course.model';
import SectionType from '@section/enum/section-type';

@Injectable()
class SectionService {
  constructor(
    public readonly cloudLogger: CloudLogger,
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
    @InjectRepository(SectionEntity)
    private readonly sectionRepository: TreeRepository<SectionEntity>,
  ) {}

  async getSectionById(id: number): Promise<SectionEntity> {
    const section = await this.sectionRepository.findOne({
      where: { id },
    });

    return section;
  }

  async getSectionByCourse(courseId: number): Promise<SectionEntity> {
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
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
  ): Promise<SectionEntity[]> {
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
    });

    const parentSection = await course.parentSection;
    const childrenSections = await this.sectionRepository
      .createDescendantsQueryBuilder(
        'section',
        'section_closure',
        parentSection,
      )
      .andWhere({ title: ILike(`%${title}%`) })
      .getMany();

    return childrenSections;
  }
}

export default SectionService;
