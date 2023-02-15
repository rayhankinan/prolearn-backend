import { SetMetadata } from '@nestjs/common';
import UserRole from '@user/enum/user-role';
import ROLES_KEY from '@user/guard/roles.key';

const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

export default Roles;
