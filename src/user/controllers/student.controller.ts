import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { StatusCodes } from 'http-status-codes';
import RegisterUserDTO from '@user/dto/register-user';
import ResponseObject from '@response/class/response-object';
import StudentEntity from '@user/models/student.model';
import StudentService from '@user/services/student.service';

@Controller('student')
class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @ApiProperty({ description: 'Register' })
  @Post('register')
  async register(@Body() body: RegisterUserDTO) {
    try {
      const { username, password } = body;

      const student = await this.studentService.register(username, password);

      return new ResponseObject<StudentEntity>(
        'Registered successfully',
        student,
      );
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        StatusCodes.BAD_REQUEST,
      );
    }
  }
}

export default StudentController;
