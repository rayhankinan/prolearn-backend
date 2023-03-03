import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import Payload from '@auth/type/payload';
import CloudLogger from '@logger/class/cloud-logger';

@Injectable()
class UserService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly cloudLogger: CloudLogger,
  ) {}

  async tokenize(payload: Payload) {
    return this.jwtService.sign(payload);
  }
}

export default UserService;
