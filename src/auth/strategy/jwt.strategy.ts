import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import jwtOptions from '@auth/config/jwt-config';
import Payload from '@auth/type/payload';

@Injectable()
class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtOptions.secret,
    });
  }

  async validate(payload: Payload) {
    return payload;
  }
}

export default JwtStrategy;
