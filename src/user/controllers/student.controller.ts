import {
  Body,
  Controller,
  HttpException,
  Post,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { StatusCodes } from 'http-status-codes';
import RegisterUserDTO from '@user/dto/register-user';
import ResponseObject from '@response/class/response-object';
import StudentEntity from '@user/models/student.model';
import StudentService from '@user/services/student.service';
import JwtAuthGuard from '@auth/guard/jwt.guard';
import Roles from '@user/guard/roles.decorator';
import UserRole from '@user/enum/user-role';
import AuthRequest from '@auth/interface/auth-request';
import RolesGuard from '@user/guard/roles.guard';
import SubscriptionUserDTO from '@user/dto/subscription-user';

@Controller('student')
class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @ApiProperty({ description: 'Register' })
  @Post('register')
  async register(@Body() body: RegisterUserDTO) {
    try {
      const { username, password } = body;

      const student = await this.studentService.register(username, password);

      return new ResponseObject<StudentEntity>(
        'Registered successfully',
        student,
      );
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }

  @ApiProperty({ description: 'Subscription' })
  @Post('subscribe/:courseId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  async subscribe(
    @Request() req: AuthRequest,
    @Param() param: SubscriptionUserDTO,
  ) {
    try {
      const { user } = req;
      const { courseId } = param;
      const userId = user.id;

      const student = await this.studentService.subscribe(userId, courseId);

      return new ResponseObject<StudentEntity>(
        'Subscribed successfully',
        student,
      );
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }
}

export default StudentController;
