import { MigrationInterface, QueryRunner } from 'typeorm';
import AdminEntity from '@user/models/admin.model';
import initialAdminOptions from '@database/config/initial-admin.config';

class AdminSeeding implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    const admin = queryRunner.manager.create<AdminEntity>(AdminEntity, {
      username: initialAdminOptions.username,
      password: initialAdminOptions.password,
    });

    await queryRunner.manager.save(admin);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    const admin = queryRunner.manager.create<AdminEntity>(AdminEntity, {
      username: initialAdminOptions.username,
      password: initialAdminOptions.password,
    });

    await queryRunner.manager.remove(admin);
  }
}

export default AdminSeeding;
