import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { hash } from 'argon2';
import UserEntity from '@user/models/user.model';

@EventSubscriber()
class UserSubscriber implements EntitySubscriberInterface<UserEntity> {
  listenTo() {
    return UserEntity;
  }

  async beforeInsert(event: InsertEvent<UserEntity>) {
    event.entity.password = await hash(event.entity.password);
  }

  async beforeUpdate(event: UpdateEvent<UserEntity>) {
    if (
      (event.entity as UserEntity).password !== event.databaseEntity.password
    ) {
      (event.entity as UserEntity).password = await hash(
        (event.entity as UserEntity).password,
      );
    }
  }
}

export default UserSubscriber;
