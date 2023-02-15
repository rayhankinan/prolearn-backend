import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import UserEntity from '@user/models/user.model';
import Payload from '@auth/type/payload';

@Injectable()
class UserService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async login(user: UserEntity) {
    const { id, role } = user;

    const payload: Payload = { id, role };
    return this.jwtService.sign(payload);
  }
}

export default UserService;
