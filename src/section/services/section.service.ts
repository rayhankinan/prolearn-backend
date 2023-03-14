import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository, TreeRepository } from 'typeorm';
import CloudLogger from '@logger/class/cloud-logger';
import SectionEntity from '@section/models/section.model';
import CourseEntity from '@course/models/course.model';

@Injectable()
class SectionService {
  constructor(
    private readonly cloudLogger: CloudLogger,
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
}

export default SectionService;
