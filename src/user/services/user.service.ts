import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import UserEntity from '@user/models/user.model';
import Payload from '@auth/type/payload';
import CloudLogger from '@logger/class/cloud-logger';
import * as argon2 from 'argon2';
import UserRole from '@user/enum/user-role';

@Injectable()
class UserService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly cloudLogger: CloudLogger,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async tokenize(payload: Payload) {
    return this.jwtService.sign(payload);
  }

  async register(username: string, password: string, role: UserRole) {
    const existingUser = await this.userRepository.findOne({where: { username } });
    console.log(existingUser);

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const hashPassowrd = await argon2.hash(password);
    const user = this.userRepository.create({ 
      username: username, 
      password: hashPassowrd, 
      role: role
    });
    console.log(user);

    return this.userRepository.save(user);
  }
}

export default UserService;
