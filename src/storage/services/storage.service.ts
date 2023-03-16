import { PassThrough } from 'stream';
import { Injectable } from '@nestjs/common';
import { Bucket, DownloadResponse, Storage } from '@google-cloud/storage';
import CloudLogger from '@logger/class/cloud-logger';
import StorageType from '@storage/enum/storage-type';
import AvailableType from '@storage/enum/available-type';
import storageConfig from '@storage/config/storage.config';

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
    const file = this.bucket.file(
      `${AvailableType.AVAILABLE}/${filetype}/${filename}`,
    );

    await file.save(content.buffer, { contentType: content.mimetype });
  }

  async download(
    filename: string,
    filetype: StorageType,
  ): Promise<DownloadResponse> {
    const file = this.bucket.file(
      `${AvailableType.AVAILABLE}/${filetype}/${filename}`,
    );
    const downloadResponse = await file.download();

    return downloadResponse;
  }

  async stream(filename: string, filetype: StorageType): Promise<PassThrough> {
    const file = this.bucket.file(
      `${AvailableType.AVAILABLE}/${filetype}/${filename}`,
    );

    const passThrough = new PassThrough();
    file.createReadStream().pipe(passThrough);

    return passThrough;
  }

  async delete(filename: string, filetype: StorageType): Promise<void> {
    const file = this.bucket.file(
      `${AvailableType.AVAILABLE}/${filetype}/${filename}`,
    );

    await file.move(`${AvailableType.NOT_AVAILABLE}/${filetype}/${filename}`);
  }

  async restore(filename: string, filetype: StorageType): Promise<void> {
    const file = this.bucket.file(
      `${AvailableType.NOT_AVAILABLE}/${filetype}/${filename}`,
    );

    await file.move(`${AvailableType.AVAILABLE}/${filetype}/${filename}`);
  }
}

export default StorageService;
