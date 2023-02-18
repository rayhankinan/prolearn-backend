import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import CloudLogger from '@logger/class/cloud-logger';
import FileEntity from '@file/models/file.model';

@Injectable()
class FileService {
  constructor(
    private readonly cloudLogger: CloudLogger,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}
}

export default FileService;
