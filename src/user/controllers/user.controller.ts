import { AuthService } from "@auth/services/auth.service";
import { Controller, Post, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Controller()
export class UserController {
    constructor(private auth: AuthService) {}

    @UseGuards(AuthGuard('local'))
    @Post('auth/login')
    async login(@Request() req) {
        return this.auth.login(req.user);
    }
}