import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import CloudLogger from '@logger/class/cloud-logger';
import FileEntity from '@file/models/file.model';
import StorageService from '@storage/services/storage.service';
import StorageType from '@storage/enum/storage-type';
import UserEntity from '@user/models/user.model';

@Injectable()
class FileService {
  constructor(
    private readonly cloudLogger: CloudLogger,
    private readonly eventEmitter: EventEmitter2,
    private readonly storageService: StorageService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  async getAllFiles(adminId: number): Promise<FileEntity[]> {
    const files = await this.fileRepository.find({
      where: { admin: { id: adminId } },
      cache: true,
    });

    return files;
  }

  async render(fileId: number): Promise<[Buffer, string]> {
    const file = await this.fileRepository.findOne({
      where: { id: fileId, isAvailable: true },
    });

    const downloadResponse = await this.storageService.download(
      file.uuid,
      file.storageType,
    );

    return [downloadResponse[0], file.mimetype];
  }

  async stream(fileId: number): Promise<[Buffer, string]> {
    const file = await this.fileRepository.findOne({
      where: { id: fileId, isAvailable: true },
    });

    const downloadStream = await this.storageService.stream(
      file.uuid,
      file.storageType,
    );

    return [downloadStream[0], file.mimetype];
  }

  async searchFilesByName(
    name: string,
    type: StorageType,
    adminId: number,
  ): Promise<FileEntity[]> {
    const files = await this.fileRepository.find({
      where: {
        admin: { id: adminId },
        name: name ? ILike(`%${name}%`) : undefined,
        storageType: type,
      },
      cache: true,
    });

    return files;
  }

  async create(
    adminId: number,
    type: StorageType,
    content: Express.Multer.File,
  ): Promise<FileEntity> {
    const file = new FileEntity();
    file.name = content.originalname;
    file.mimetype = content.mimetype;
    file.storageType = type;
    file.isAvailable = false;
    file.uuid = uuidv4();

    const admin = await this.userRepository.findOne({
      where: { id: adminId },
    });
    file.admin = Promise.resolve(admin);

    await this.eventEmitter.emitAsync('file.created', file, content);

    return await this.fileRepository.save(file);
  }

  async edit(
    id: number,
    adminId: number,
    type: StorageType,
    content: Express.Multer.File,
  ): Promise<FileEntity> {
    const file = await this.fileRepository.findOne({
      where: { id, storageType: type, admin: { id: adminId } },
    });
    file.name = content.originalname;
    file.mimetype = content.mimetype;
    file.isAvailable = false;

    await this.eventEmitter.emitAsync('file.updated', file, content);

    return await this.fileRepository.save(file);
  }

  async delete(
    id: number,
    adminId: number,
    type: StorageType,
  ): Promise<FileEntity> {
    const file = await this.fileRepository.findOne({
      where: { id, storageType: type, admin: { id: adminId } },
    });

    await this.eventEmitter.emitAsync('file.deleted', file);

    return await this.fileRepository.softRemove(file);
  }

  @OnEvent('file.created', { async: true })
  async onFileUploaded(file: FileEntity, content: Express.Multer.File) {
    file.isAvailable = true;

    await this.storageService.upload(file.uuid, file.storageType, content);
    await this.fileRepository.save(file);
  }

  @OnEvent('file.updated', { async: true })
  async onFileUpdated(file: FileEntity, content: Express.Multer.File) {
    await this.storageService.delete(file.uuid, file.storageType);

    file.uuid = uuidv4();
    file.isAvailable = true;

    await this.storageService.upload(file.uuid, file.storageType, content);
    await this.fileRepository.save(file);
  }

  @OnEvent('file.deleted', { async: true })
  async onFileDeleted(file: FileEntity) {
    await this.storageService.delete(file.uuid, file.storageType);
  }
}

export default FileService;
