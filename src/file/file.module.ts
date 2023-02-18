import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import FileEntity from '@file/models/file.model';
import FileService from './services/file.service';
import LoggerModule from '@logger/logger.module';
import StorageModule from '@storage/storage.module';
import AdminEntity from '@user/models/admin.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity, AdminEntity]),
    LoggerModule,
    StorageModule,
  ],
  providers: [FileService],
  controllers: [],
})
class FileModule {}

export default FileModule;
