import { JwtModuleOptions } from '@nestjs/jwt';

const jwtOptions: JwtModuleOptions = {
  secret: process.env.JWT_SECRET,
  signOptions: {
    expiresIn: process.env.EXPIRES_IN || '24h',
  },
};

export default jwtOptions;
