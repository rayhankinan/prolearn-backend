import { ChildEntity, Column } from 'typeorm';
import UserEntity from '@user/models/user.model';
import UserRole from '@user/enum/user-role';

@ChildEntity('admin')
class AdminEntity extends UserEntity {
  @Column({ type: 'enum', enum: UserRole, default: UserRole.ADMIN })
  readonly role: UserRole;
}

export default AdminEntity;
