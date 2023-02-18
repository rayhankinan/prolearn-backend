import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserEntity from '@user/models/user.model';
import AuthService from '@auth/services/auth.service';
import LocalStrategy from '@auth/strategy/local.strategy';
import JwtStrategy from './strategy/jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), PassportModule],
  controllers: [],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
class AuthModule {}

export default AuthModule;
