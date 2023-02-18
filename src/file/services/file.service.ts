import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import CloudLogger from '@logger/class/cloud-logger';
import FileEntity from '@file/models/file.model';
import StorageService from '@storage/services/storage.service';
import StorageType from '@storage/enum/storage-type';
import AdminEntity from '@user/models/admin.model';

@Injectable()
class FileService {
  constructor(
    private readonly cloudLogger: CloudLogger,
    private readonly storageService: StorageService,
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  async getAllFiles(adminId: number): Promise<FileEntity[]> {
    const files = await this.fileRepository.find({
      where: { admin: { id: adminId } },
    });

    return files;
  }

  async render(fileId: number): Promise<[Buffer, string]> {
    const file = await this.fileRepository.findOne({
      where: { id: fileId },
    });

    const downloadResponse = await this.storageService.download(
      file.uuid,
      StorageType.FILE,
    );

    return [downloadResponse[0], file.mimetype];
  }

  async searchFilesByName(
    name: string,
    adminId: number,
  ): Promise<FileEntity[]> {
    const files = await this.fileRepository.find({
      where: { admin: { id: adminId }, name: ILike(`%${name}%`) },
    });

    return files;
  }

  async create(
    name: string,
    adminId: number,
    content: Express.Multer.File,
  ): Promise<FileEntity> {
    const file = new FileEntity();

    const uuid = uuidv4();
    await this.storageService.upload(uuid, StorageType.FILE, content);

    file.name = name;
    file.uuid = uuid;
    file.mimetype = content.mimetype;

    const admin = await this.adminRepository.findOne({
      where: { id: adminId },
    });
    file.admin = Promise.resolve(admin);

    return await this.fileRepository.save(file);
  }

  async edit(
    id: number,
    name: string,
    adminId: number,
    content: Express.Multer.File,
  ): Promise<FileEntity> {
    const file = await this.fileRepository.findOne({
      where: { id, admin: { id: adminId } },
    });

    /* Soft Deletion in Object Storage */
    await this.storageService.delete(file.uuid, StorageType.FILE);

    const uuid = uuidv4();
    await this.storageService.upload(uuid, StorageType.FILE, content);

    file.name = name;
    file.uuid = uuid;
    file.mimetype = content.mimetype;

    return await this.fileRepository.save(file);
  }

  async delete(id: number, adminId: number): Promise<FileEntity> {
    const file = await this.fileRepository.findOne({
      where: { id, admin: { id: adminId } },
    });

    /* Soft Deletion in Object Storage */
    await this.storageService.delete(file.uuid, StorageType.FILE);

    return await this.fileRepository.remove(file);
  }
}

export default FileService;
