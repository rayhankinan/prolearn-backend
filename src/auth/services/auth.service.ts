import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { verify } from 'argon2';
import UserEntity from '@user/models/user.model';

@Injectable()
class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async validateUser(username: string, password: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { username } });

    const isValid = await verify(user.password, password);
    if (!isValid) {
      throw new UnauthorizedException();
    }

    return user;
  }
}

export default AuthService;
