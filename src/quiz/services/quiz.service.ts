import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CloudLogger from '@logger/class/cloud-logger';
import QuizEntity from '@quiz/models/quiz.model';
import SectionEntity from '@section/models/section.model';
import QuizType from '@quiz/types/quiz.type';

@Injectable()
class QuizService {
  constructor(
    private readonly cloudLogger: CloudLogger,
    @InjectRepository(QuizEntity)
    private readonly quizRepository: Repository<QuizEntity>,
    @InjectRepository(SectionEntity)
    private readonly sectionRepository: Repository<SectionEntity>,
  ) {}

  async getQuizBySection(sectionId: number): Promise<QuizEntity> {
    const quiz = await this.quizRepository.findOne({
      where: { section: { id: sectionId } },
    });

    return quiz;
  }

  async create(content: QuizType, sectionId: number): Promise<QuizEntity> {
    const quiz = new QuizEntity();
    quiz.content = content;

    const section = await this.sectionRepository.findOne({
      where: { id: sectionId },
    });
    quiz.section = Promise.resolve(section);

    return await this.quizRepository.save(quiz);
  }

  async edit(
    id: number,
    content: QuizType,
    sectionId: number,
  ): Promise<QuizEntity> {
    const quiz = await this.quizRepository.findOne({
      where: { id },
    });
    quiz.content = content;

    const section = await this.sectionRepository.findOne({
      where: { id: sectionId },
    });
    quiz.section = Promise.resolve(section);

    return await this.quizRepository.save(quiz);
  }

  async delete(id: number): Promise<QuizEntity> {
    const quiz = await this.quizRepository.findOne({
      where: { id },
    });

    return await this.quizRepository.softRemove(quiz);
  }
}

export default QuizService;
