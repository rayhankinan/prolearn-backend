import { Injectable } from '@nestjs/common';
import {
  Bucket,
  DownloadResponse,
  MoveResponse,
  Storage,
} from '@google-cloud/storage';
import storageConfig from '@storage/config/storage.config';
import CloudLogger from '@logger/class/cloud-logger';
import StorageType from '@storage/enum/storage-type';
import AvailableType from '@storage/enum/available-type';

@Injectable()
class StorageService {
  private readonly bucket: Bucket;

  constructor(private readonly cloudLogger: CloudLogger) {
    const storage = new Storage();

    this.bucket = storage.bucket(storageConfig.bucketName);
  }

  async upload(
    filename: string,
    filetype: StorageType,
    content: Express.Multer.File,
  ): Promise<void> {
    await this.bucket
      .file(`${AvailableType.AVAILABLE}/${filetype}/${filename}`)
      .save(content.buffer);
  }

  async download(
    filename: string,
    filetype: StorageType,
  ): Promise<DownloadResponse> {
    const file = await this.bucket
      .file(`${AvailableType.AVAILABLE}/${filetype}/${filename}`)
      .download();
    return file;
  }

  async delete(filename: string, filetype: StorageType): Promise<MoveResponse> {
    const file = await this.bucket
      .file(`${AvailableType.AVAILABLE}/${filetype}/${filename}`)
      .move(`${AvailableType.NOT_AVAILABLE}/${filetype}/${filename}`);
    return file;
  }

  async restore(
    filename: string,
    filetype: StorageType,
  ): Promise<MoveResponse> {
    const file = await this.bucket
      .file(`${AvailableType.NOT_AVAILABLE}/${filetype}/${filename}`)
      .move(`${AvailableType.AVAILABLE}/${filetype}/${filename}`);
    return file;
  }
}

export default StorageService;
