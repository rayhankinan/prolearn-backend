import {
  Controller,
  HttpException,
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
}

export default UserController;
