import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserController from '@user/controllers/user.controller';
import StudentEntity from '@user/models/student.model';
import UserService from '@user/services/user.service';
import jwtOptions from '@auth/config/jwt-config';
import LoggerModule from '@logger/logger.module';
import CourseEntity from '@course/models/course.model';
import StudentService from './services/student.service';
import StudentController from './controllers/student.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudentEntity, CourseEntity]),
    JwtModule.register(jwtOptions),
    LoggerModule,
  ],
  controllers: [UserController, StudentController],
  providers: [UserService, StudentService],
})
class UserModule {}

export default UserModule;
