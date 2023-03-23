import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CloudLogger from '@logger/class/cloud-logger';
import QuizEntity from '@quiz/models/quiz.model';
import SectionEntity from '@section/models/section.model';
import QuizType from '@quiz/types/quiz.type';
import UserEntity from '@user/models/user.model';
import QuizUserEntity from '@quizuser/models/quiz-user.model';

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

  async create(content: QuizType): Promise<QuizEntity> {
    const quiz = new QuizEntity();
    quiz.content = content;

    return await this.quizRepository.save(quiz);
  }

  async edit(id: number, content: QuizType): Promise<QuizEntity> {
    const quiz = await this.quizRepository.findOne({
      where: { id },
    });
    quiz.content = content;

    return await this.quizRepository.save(quiz);
  }

  async delete(id: number): Promise<QuizEntity> {
    const quiz = await this.quizRepository.findOne({
      where: { id },
    });

    return await this.quizRepository.softRemove(quiz);
  }

  async submitQuiz(
    userId: number,
    quizId: number,
    answer: number[],
  ): Promise<QuizUserEntity> {
    var quizUser = await this.quizUserRepository.findOne({
      where: { quizzes: { id: quizId }, users: { id: userId } },
    });

    if (!quizUser) {
      quizUser = new QuizUserEntity();
    }

    const quiz = await this.quizRepository.findOne({
      where: { id: quizId },
    });
    quizUser.quizzes = Promise.resolve(quiz);

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    quizUser.users = Promise.resolve(user);

    var length = Math.min(answer.length, quiz.content.questions.length);

    var correct_answer = 0;
    for (var i = 0; i < length; i++) {
      var ansQuestion = answer[i];
      if (quiz.content.questions[i].options[ansQuestion].isCorrect) {
        correct_answer++;
      }
    }
    quizUser.correct_answer = correct_answer;

    quizUser = await this.quizUserRepository.save(quizUser);

    return await this.quizUserRepository.findOne({
      where: { id: quizUser.id },
    });
  }
}

export default QuizService;
