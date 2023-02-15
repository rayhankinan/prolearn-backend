import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import UserEntity from '@user/models/user.model';
import UserService from '@user/services/user.service';

@Controller('user')
class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req: Request & { user: UserEntity }) {
    return await this.userService.login(req.user);
  }
}

export default UserController;
