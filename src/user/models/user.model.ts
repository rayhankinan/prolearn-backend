import { Column, Entity, TableInheritance } from 'typeorm';
import { Exclude } from 'class-transformer';
import Base from '@database/models/base';

@Entity('user')
@TableInheritance({ column: 'role' })
class UserEntity extends Base {
  @Column({ type: 'varchar', length: 255, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  @Exclude()
  password: string;
}

export default UserEntity;
