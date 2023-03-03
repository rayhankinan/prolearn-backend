import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CloudLogger from '@logger/class/cloud-logger';
import StudentEntity from '@user/models/student.model';
import CourseEntity from '@course/models/course.model';

@Injectable()
class StudentService {
  constructor(
    private readonly cloudLogger: CloudLogger,
    @InjectRepository(StudentEntity)
    private readonly studentRepository: Repository<StudentEntity>,
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
  ) {}

  async register(username: string, password: string): Promise<StudentEntity> {
    const student = this.studentRepository.create({
      username: username,
      password: password,
    });

    return this.studentRepository.save(student);
  }

  async subscribe(id: number, courseId: number): Promise<StudentEntity> {
    const student = await this.studentRepository.findOne({ where: { id } });

    const course = await this.courseRepository.findOne({
      where: { id: courseId },
    });

    const currentCourses = await student.courses;
    const newCourses = [...currentCourses, course];
    student.courses = Promise.resolve(newCourses);

    return this.studentRepository.save(student);
  }
}

export default StudentService;
