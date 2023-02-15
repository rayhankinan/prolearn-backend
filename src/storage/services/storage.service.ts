import { Bucket, DownloadResponse, Storage } from '@google-cloud/storage';
import storageConfig from '@storage/config/storage.config';
import CloudLogger from '@logger/cloud.logger';

class StorageService {
  private readonly bucket: Bucket;
  private readonly cloudLogger: CloudLogger;

  constructor() {
    const storage = new Storage();

    this.bucket = storage.bucket(storageConfig.bucketName);
    this.cloudLogger = new CloudLogger(StorageService.name);
  }

  async upload(
    filename: string,
    uploadPath: string,
    file: Express.Multer.File,
  ): Promise<void> {
    await this.bucket.file(`${uploadPath}/${filename}`).save(file.buffer);
  }

  async download(
    filename: string,
    uploadPath: string,
  ): Promise<DownloadResponse> {
    const file = await this.bucket.file(`${uploadPath}/${filename}`).download();
    return file;
  }
}

export default StorageService;
