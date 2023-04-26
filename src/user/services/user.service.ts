import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import Payload from '@auth/type/payload';
import CloudLogger from '@logger/class/cloud-logger';
import UserEntity from '@user/models/user.model';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import CourseEntity from '@course/models/course.model';

@Injectable()
class UserService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly cloudLogger: CloudLogger,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
  ) {}

  async tokenize(payload: Payload) {
    return this.jwtService.sign(payload);
  }

  async register(username: string, password: string): Promise<UserEntity> {
    const student = this.userRepository.create({
      username: username,
      password: password,
    });

    return this.userRepository.save(student);
  }

  async subscribe(id: number, courseId: number): Promise<UserEntity> {
    const student = await this.userRepository.findOneOrFail({ where: { id } });

    const course = await this.courseRepository.findOneOrFail({
      where: { id: courseId },
    });
    const currentCourses = await student.courses_subscribed;
    if (currentCourses.includes(course)) {
      return student;
    }
    const newCourses = [...currentCourses, course];
    student.courses_subscribed = Promise.resolve(newCourses);
    return this.userRepository.save(student);
  }
}

export default UserService;
