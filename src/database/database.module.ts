import { Module } from '@nestjs/common';
import databaseProviders from '@database/providers/database.provider';

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
class DatabaseModule {}

export default DatabaseModule;
