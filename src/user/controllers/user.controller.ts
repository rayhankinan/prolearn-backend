import {
  Body,
  Controller,
  HttpException,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { StatusCodes } from 'http-status-codes';
import UserService from '@user/services/user.service';
import RegisterUserDTO from '@user/dto/register-user';
import LocalAuthGuard from '@auth/guard/local.guard';
import AuthRequest from '@auth/interface/auth-request';
import ResponseObject from '@response/class/response-object';
import StudentEntity from '@user/models/student.model';

@Controller('user')
class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiProperty({ description: 'Login' })
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req: AuthRequest) {
    try {
      const token = await this.userService.tokenize(req.user);

      return new ResponseObject<string>('Login is successful', token);
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }

  @ApiProperty({ description: 'Register' })
  @Post('register')
  async register(@Body() body: RegisterUserDTO) {
    try {
      const { username, password } = body;

      const student = await this.userService.register(username, password);

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
}

export default UserController;
