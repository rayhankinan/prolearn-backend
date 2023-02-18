import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { verify } from 'argon2';
import UserEntity from '@user/models/user.model';
import Payload from '@auth/type/payload';

@Injectable()
class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async validateUser(username: string, password: string): Promise<Payload> {
    const user = await this.userRepository.findOne({ where: { username } });

    const isValid = await verify(user.password, password);
    if (!isValid) {
      throw new UnauthorizedException();
    }

    const payload: Payload = { id: user.id, role: user.role };

    return payload;
  }
}

export default AuthService;
