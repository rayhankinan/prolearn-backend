import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CloudLogger from '@logger/class/cloud-logger';
import QuizEntity from '@quiz/models/quiz.model';
import QuizType from '@quiz/types/quiz.type';
import UserEntity from '@user/models/user.model';
import QuizUserEntity from '@quizuser/models/quiz-user.model';

@Injectable()
class QuizService {
  constructor(
    private readonly cloudLogger: CloudLogger,
    @InjectRepository(QuizEntity)
    private readonly quizRepository: Repository<QuizEntity>,
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

  async getHistory(userId: number, quizId: number): Promise<QuizUserEntity> {
    const quizUser = await this.quizUserRepository.findOne({
      where: { quizzes: { id: quizId }, users: { id: userId } },
    });

    return quizUser;
  }

  async submitQuiz(
    userId: number,
    quizId: number,
    answer: number[],
  ): Promise<QuizUserEntity> {
    let quizUser = await this.quizUserRepository.findOne({
      where: { quizzes: { id: quizId }, users: { id: userId } },
      relations: { quizzes: true, users: true },
    });

    if (!quizUser) {
      quizUser = new QuizUserEntity();

      const quiz = await this.quizRepository.findOne({
        where: { id: quizId },
      });
      quizUser.quizzes = Promise.resolve(quiz);

      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      quizUser.users = Promise.resolve(user);
    }

    const currentQuiz = await quizUser.quizzes;
    const length = Math.min(
      answer.length,
      currentQuiz.content.questions.length,
    );

    let correctAnswers = 0;
    for (let i = 0; i < length; i++) {
      const ansQuestion = answer[i];

      if (currentQuiz.content.questions[i].options[ansQuestion].isCorrect)
        correctAnswers++;
    }
    quizUser.correctAnswers = correctAnswers;

    return await this.quizUserRepository.save(quizUser);
  }
}

export default QuizService;
