import { LocalStrategy } from "@auth/local.strategy";
import { AuthService } from "@auth/services/auth.service";
import { Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserController } from "./controllers/user.controller";
import UserEntity from "./models/user.model";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        PassportModule,
        JwtModule.register({
            secret: 'secretKey',
            signOptions: { expiresIn: '60s' },
    })],
    controllers: [UserController],
    providers: [AuthService, LocalStrategy],
})

export class UserModule {}