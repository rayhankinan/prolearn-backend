import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import UserService from '@user/services/user.service';
import LocalAuthGuard from '@auth/guard/local.guard';
import AuthRequest from '@auth/interface/auth-request';
import ResponseObject from '@response/class/response-object';

@Controller('user')
class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req: AuthRequest) {
    const token = await this.userService.tokenize(req.user);

    return new ResponseObject<string>('Login is successful', token);
  }
}

export default UserController;
