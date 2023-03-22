import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CloudLogger from '@logger/class/cloud-logger';
import QuizEntity from '@quiz/models/quiz.model';
import SectionEntity from '@section/models/section.model';
import QuizType from '@quiz/types/quiz.type';
import UserEntity from '@user/models/user.model';
import QuizUserEntity from '@quizuser/models/quizuser.model';
import AnswerType from '@quiz/types/answer.type';

@Injectable()
class QuizService {
  constructor(
    private readonly cloudLogger: CloudLogger,
    @InjectRepository(QuizEntity)
    private readonly quizRepository: Repository<QuizEntity>,
    @InjectRepository(SectionEntity)
    private readonly sectionRepository: Repository<SectionEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(QuizUserEntity)
    private readonly quizUserRepository: Repository<QuizUserEntity>,
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

  async submitQuiz(userId: number, quizId: number, answer: AnswerType): Promise<QuizUserEntity> {
    const quizUser = new QuizUserEntity();

    const quiz = await this.quizRepository.findOne({
      where: { id: quizId },
    });
    quizUser.quizzes = Promise.resolve(quiz);

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    quizUser.users = Promise.resolve(user);

    var length = Math.min(answer.options.length, 
      quiz.content.questions.length);

    var correct_answer = 0;
    for (var i = 0; i < length; i++) {
      var ansQuestion = answer.options[i];
      if (quiz.content.questions[i].options[ansQuestion].isCorrect) {
        correct_answer++;
      }
    }
    quizUser.correct_answer = correct_answer;

    return await this.quizUserRepository.save(quizUser);
  }
}

export default QuizService;
