import { Column, Entity, TableInheritance } from 'typeorm';
import Base from '@common/models/base';

@Entity('user')
@TableInheritance({ column: 'role' })
class UserEntity extends Base {
  @Column({ type: 'varchar', length: 255, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;
}

export default UserEntity;
