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

  async render(fileId: number, type: StorageType): Promise<[Buffer, string]> {
    const file = await this.fileRepository.findOne({
      where: { id: fileId, storageType: type, isAvailable: true },
    });

    const downloadResponse = await this.storageService.download(
      file.uuid,
      type,
    );

    return [downloadResponse[0], file.mimetype];
  }

  async stream(fileId: number, type: StorageType): Promise<[Buffer, string]> {
    const file = await this.fileRepository.findOne({
      where: { id: fileId, storageType: type, isAvailable: true },
    });

    const downloadStream = await this.storageService.stream(file.uuid, type);

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

    await this.eventEmitter.emitAsync('file.created', file, type, content);

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
    file.uuid = uuidv4();

    await this.eventEmitter.emitAsync('file.updated', file);

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
  async onFileUploaded(
    file: FileEntity,
    type: StorageType,
    content: Express.Multer.File,
  ) {
    await this.storageService.upload(file.uuid, type, content);

    file.isAvailable = true;
    await this.fileRepository.save(file);
  }

  @OnEvent('file.updated', { async: true })
  async onFileUpdated(
    file: FileEntity,
    type: StorageType,
    content: Express.Multer.File,
  ) {
    await this.storageService.delete(file.uuid, type);
    await this.storageService.upload(file.uuid, type, content);

    file.isAvailable = true;
    await this.fileRepository.save(file);
  }

  @OnEvent('file.deleted', { async: true })
  async onFileDeleted(file: FileEntity, type: StorageType) {
    await this.storageService.delete(file.uuid, type);
  }
}

export default FileService;
