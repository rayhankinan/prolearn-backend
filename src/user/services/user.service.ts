import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import UserEntity from '@user/models/user.model';
import Payload from '@auth/type/payload';
import CloudLogger from '@logger/class/cloud-logger';

@Injectable()
class UserService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly cloudLogger: CloudLogger,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async login(user: UserEntity) {
    const payload: Payload = { id: user.id };
    return this.jwtService.sign(payload);
  }
}

export default UserService;
