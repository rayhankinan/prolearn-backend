import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import AuthService from '@auth/services/auth.service';
import jwtOptions from '@auth/config/jwt-config';
import Payload from '@auth/type/payload';

@Injectable()
class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtOptions.secret,
    });
  }

  async validate(payload: Payload) {
    const user = await this.authService.getUserById(payload.id);
    return user;
  }
}

export default JwtStrategy;
