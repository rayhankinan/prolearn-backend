import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository, TreeRepository } from 'typeorm';
import CloudLogger from '@logger/class/cloud-logger';
import FileService from '@file/services/file.service';
import SectionEntity from '@section/models/section.model';
import CourseEntity from '@course/models/course.model';
import StorageType from '@storage/enum/storage-type';
import QuizType from '@quiz/types/quiz.type';
import QuizService from '@quiz/services/quiz.service';

@Injectable()
class SectionService {
  constructor(
    private readonly cloudLogger: CloudLogger,
    private readonly fileService: FileService,
    private readonly quizService: QuizService,
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
    @InjectRepository(SectionEntity)
    private readonly sectionRepository: TreeRepository<SectionEntity>,
  ) {}

  async getSectionByCourse(
    courseId: number,
    studentId: number,
  ): Promise<SectionEntity[]> {
    const course = await this.courseRepository.findOneOrFail({
      where: { id: courseId, subscribers: { id: studentId } },
    });

    const sections = await this.sectionRepository.find({
      relations: { file: true, quiz: true },
      where: { course: { id: course.id } },
    });

    return sections;
  }

  async searchSectionsByTitle(
    courseId: number,
    title: string,
    studentId: number,
  ): Promise<SectionEntity[]> {
    const course = await this.courseRepository.findOneOrFail({
      where: { id: courseId, subscribers: { id: studentId } },
    });

    const sections = await this.sectionRepository.find({
      relations: { file: true, quiz: true },
      where: { course: { id: course.id }, title: ILike(`%${title}%`) },
    });

    return sections;
  }

  async create(
    title: string,
    objective: string,
    duration: number,
    courseId: number,
    adminId: number,
    quizType?: QuizType,
    fileContent?: Express.Multer.File,
  ): Promise<SectionEntity> {
    const section = new SectionEntity();
    section.title = title;
    section.objective = objective;
    section.duration = duration;

    const course = await this.courseRepository.findOneOrFail({
      where: { id: courseId, admin: { id: adminId } },
    });
    section.course = Promise.resolve(course);

    if (fileContent) {
      const file = await this.fileService.create(
        adminId,
        StorageType.HTML,
        fileContent,
      );
      section.file = Promise.resolve(file);
    }

    if (quizType) {
      const quiz = await this.quizService.create(quizType);
      section.quiz = Promise.resolve(quiz);
    }

    return await this.sectionRepository.save(section);
  }

  async edit(
    id: number,
    title: string,
    objective: string,
    duration: number,
    courseId: number,
    adminId: number,
    quizType?: QuizType,
    fileContent?: Express.Multer.File,
  ): Promise<SectionEntity> {
    const section = await this.sectionRepository.findOneOrFail({
      where: { id },
    });
    section.title = title;
    section.objective = objective;
    section.duration = duration;

    const course = await this.courseRepository.findOneOrFail({
      where: { id: courseId, admin: { id: adminId } },
    });
    section.course = Promise.resolve(course);

    if (fileContent) {
      const file = await section.file;

      if (file) {
        const editedFile = await this.fileService.edit(
          file.id,
          adminId,
          StorageType.HTML,
          fileContent,
        );
        section.file = Promise.resolve(editedFile);
      } else {
        const newFile = await this.fileService.create(
          adminId,
          StorageType.HTML,
          fileContent,
        );
        section.file = Promise.resolve(newFile);
      }
    }

    if (quizType) {
      const quiz = await section.quiz;

      if (quiz) {
        const editedQuiz = await this.quizService.edit(quiz.id, quizType);
        section.quiz = Promise.resolve(editedQuiz);
      } else {
        const newQuiz = await this.quizService.create(quizType);
        section.quiz = Promise.resolve(newQuiz);
      }
    }

    return await this.sectionRepository.save(section);
  }

  async delete(id: number, adminId: number): Promise<SectionEntity> {
    const section = await this.sectionRepository.findOneOrFail({
      where: { id },
    });
    const file = await section.file;
    const quiz = await section.quiz;

    if (file) {
      await this.fileService.delete(file.id, adminId, StorageType.HTML);
    }

    if (quiz) {
      await this.quizService.delete(quiz.id);
    }

    return await this.sectionRepository.softRemove(section);
  }
}

export default SectionService;
