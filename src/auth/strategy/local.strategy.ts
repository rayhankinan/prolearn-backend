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
    try {
      const payload = await this.authService.validateUser(username, password);

      return payload;
    } catch (error) {
      return null;
    }
  }
}

export default LocalStrategy;
