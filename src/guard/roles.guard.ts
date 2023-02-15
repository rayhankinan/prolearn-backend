import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import UserRole from '@user/enum/user-role';
import { ROLES_KEY } from './roles.decorator';
import * as jwt from 'jsonwebtoken';

@Injectable()
class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const reqRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!reqRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const authorization = user.headers.authorization;

    const token = authorization.replace('Bearer ', '');
    try {
      const decoded = jwt.verify(token, 'secret');
      return reqRoles.some((role) => user.roles?.includes(role));
    } catch (error) {
      return false;
    }
  }
}

export default RolesGuard;
