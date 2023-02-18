import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import AuthService from '@auth/services/auth.service';
import Payload from '@auth/type/payload';

@Injectable()
class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<Payload> {
    const user = await this.authService.validateUser(username, password);
    const payload: Payload = { userId: user.id, role: user.role };

    return payload;
  }
}

export default LocalStrategy;
