import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import FileEntity from '@file/models/file.model';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  providers: [],
  controllers: [],
})
class FileModule {}

export default FileModule;
