import { Module } from '@nestjs/common';
import StorageService from '@storage/services/storage.service';
import LoggerModule from '@logger/logger.module';

@Module({
  imports: [LoggerModule],
  providers: [StorageService],
  exports: [StorageService],
})
class StorageModule {}

export default StorageModule;
