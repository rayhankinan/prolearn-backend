import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserController from '@user/controllers/user.controller';
import UserEntity from '@user/models/user.model';
import UserService from './services/user.service';
import jwtOptions from '@auth/config/jwt-config';
import LoggerModule from '@logger/logger.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register(jwtOptions),
    LoggerModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
class UserModule {}

export default UserModule;
