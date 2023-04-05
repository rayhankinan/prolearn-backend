import {
  Controller,
  HttpException,
  UseGuards,
  Request,
  Post,
  Get,
  Body,
  Param,
} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { StatusCodes } from 'http-status-codes';
import ResponseObject from '@response/class/response-object';
import JwtAuthGuard from '@auth/guard/jwt.guard';
import RolesGuard from '@user/guard/roles.guard';
import Roles from '@user/guard/roles.decorator';
import UserRole from '@user/enum/user-role';
import AuthRequest from '@auth/interface/auth-request';
import QuizService from '@quiz/services/quiz.service';
import SubmitQuizDto from '@quiz/dto/submit-quiz';
import ViewHistoryDto from '@quiz/dto/view-history';
import QuizUserEntity from '@quizuser/models/quiz-user.model';

@Controller('quiz')
class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @ApiProperty({ description: 'View Quiz History' })
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STUDENT)
  async viewHistory(
    @Request() req: AuthRequest,
    @Param() param: ViewHistoryDto,
  ) {
    try {
      const { user } = req;
      const { quizId } = param;
      const studentId = user.role === UserRole.STUDENT ? user.id : undefined;

      const quizUser = await this.quizService.getHistory(studentId, quizId);

      return new ResponseObject<QuizUserEntity>(
        'Quiz history retrieved successfully',
        quizUser,
      );
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }

  @ApiProperty({ description: 'Submit Quiz' })
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  async submitQuiz(@Request() req: AuthRequest, @Body() body: SubmitQuizDto) {
    try {
      const { user } = req;
      const { quizId, answer } = body;
      const studentId = user.id;

      const quiz = await this.quizService.submitQuiz(studentId, quizId, answer);

      return new ResponseObject<QuizUserEntity>(
        'Quiz submitted successfully',
        quiz,
      );
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }
}

export default QuizController;
