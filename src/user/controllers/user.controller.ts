import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import UserEntity from '@user/models/user.model';
import UserService from '@user/services/user.service';
import LocalAuthGuard from '@auth/guard/local.guard';

@Controller('user')
class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: Request & { user: UserEntity }) {
    return await this.userService.login(req.user);
  }
}

export default UserController;
