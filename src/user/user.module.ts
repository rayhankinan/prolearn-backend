import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserController from '@user/controllers/user.controller';
import UserService from '@user/services/user.service';
import jwtOptions from '@auth/config/jwt-config';
import LoggerModule from '@logger/logger.module';
import UserEntity from '@user/models/user.model';
import CourseEntity from '@course/models/course.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, CourseEntity]),
    JwtModule.register(jwtOptions),
    LoggerModule,
  ],
  providers: [UserService],
  controllers: [UserController],
})
class UserModule {}

export default UserModule;
