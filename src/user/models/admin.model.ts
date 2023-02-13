import { ChildEntity, Column } from 'typeorm';
import UserEntity from '@user/models/user.model';
import UserRole from '@user/enum/user-role';

@ChildEntity()
class AdminEntity extends UserEntity {
  @Column({ type: 'enum', enum: UserRole, default: UserRole.STUDENT })
  readonly role: UserRole;
}

export default AdminEntity;
