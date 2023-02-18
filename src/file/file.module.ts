import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import FileEntity from '@file/models/file.model';
import FileService from './services/file.service';
import LoggerModule from '@logger/logger.module';
import ResponseModule from '@response/response.module';
import StorageModule from '@storage/storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity]),
    LoggerModule,
    ResponseModule,
    StorageModule,
  ],
  providers: [FileService],
  controllers: [],
})
class FileModule {}

export default FileModule;
