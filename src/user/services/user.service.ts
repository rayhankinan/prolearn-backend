import { Logger, Injectable } from '@nestjs/common';

/* Contoh Service (Ada logger) */
@Injectable()
class UserService {
  private readonly logger = new Logger(UserService.name);
}

export default UserService;
