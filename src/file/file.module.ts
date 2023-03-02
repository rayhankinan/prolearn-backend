import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import FileEntity from '@file/models/file.model';
import FileService from './services/file.service';
import LoggerModule from '@logger/logger.module';
import StorageModule from '@storage/storage.module';
import AdminEntity from '@user/models/admin.model';
import FileController from '@file/controller/file.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity, AdminEntity]),
    LoggerModule,
    StorageModule,
  ],
  providers: [FileService],
  controllers: [FileController],
  exports: [FileService],
})
class FileModule {}

export default FileModule;
