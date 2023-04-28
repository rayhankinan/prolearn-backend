import {
  Body,
  Controller,
  HttpException,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { StatusCodes } from 'http-status-codes';
import UserService from '@user/services/user.service';
import LocalAuthGuard from '@auth/guard/local.guard';
import AuthRequest from '@auth/interface/auth-request';
import ResponseObject from '@response/class/response-object';
import RegisterUserDTO from '@user/dto/register-user';
import SubscriptionUserDTO from '@user/dto/subscription-user';
import UserEntity from '@user/models/user.model';
import JwtAuthGuard from '@auth/guard/jwt.guard';
import RolesGuard from '@user/guard/roles.guard';
import Roles from '@user/guard/roles.decorator';
import UserRole from '@user/enum/user-role';

@Controller('user')
class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiProperty({ description: 'Login' })
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req: AuthRequest) {
    try {
      const token = await this.userService.tokenize(req.user);

      return new ResponseObject<string>(
        'Login is successful',
        token,
        null,
        req.user.role,
      );
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

      const user = await this.userService.register(username, password);

      return new ResponseObject<UserEntity>('Registered successfully', user);
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

      const student = await this.userService.subscribe(userId, courseId);

      return new ResponseObject<UserEntity>('Subscribed successfully', student);
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }
}

export default UserController;
