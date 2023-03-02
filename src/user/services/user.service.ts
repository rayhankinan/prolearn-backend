import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import Payload from '@auth/type/payload';
import { hash } from 'argon2';
import CloudLogger from '@logger/class/cloud-logger';
import StudentEntity from '@user/models/student.model';

@Injectable()
class UserService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly cloudLogger: CloudLogger,
    @InjectRepository(StudentEntity)
    private readonly studentRepository: Repository<StudentEntity>,
  ) {}

  async tokenize(payload: Payload) {
    return this.jwtService.sign(payload);
  }

  async register(username: string, password: string): Promise<StudentEntity> {
    const student = this.studentRepository.create({
      username: username,
      password: password,
    });

    return this.studentRepository.save(student);
  }
}

export default UserService;
