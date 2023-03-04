import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import FileEntity from '@file/models/file.model';
import FileService from './services/file.service';
import LoggerModule from '@logger/logger.module';
import StorageModule from '@storage/storage.module';
import FileController from '@file/controller/file.controller';
import UserEntity from '@user/models/user.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity, UserEntity]),
    LoggerModule,
    StorageModule,
  ],
  providers: [FileService],
  controllers: [FileController],
  exports: [FileService],
})
class FileModule {}

export default FileModule;
