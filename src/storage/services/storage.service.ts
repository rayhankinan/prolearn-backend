import { PassThrough } from 'stream';
import { Response } from 'express';
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
    const file = this.bucket.file(
      `${AvailableType.AVAILABLE}/${filetype}/${filename}`,
    );

    await file.save(content.buffer, { contentType: content.mimetype });
  }

  async streamingUpload(
    filename: string,
    filetype: StorageType,
    content: Express.Multer.File,
  ) {
    const passThrough = new PassThrough();
    passThrough.write(content);
    passThrough.end;

    const file = this.bucket.file(
      `${AvailableType.AVAILABLE}/${filetype}/${filename}`,
    );

    passThrough.pipe(file.createWriteStream({ contentType: content.mimetype }));
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

  async streamingDownload(
    filename: string,
    filetype: StorageType,
    res: Response,
  ) {
    const file = this.bucket.file(
      `${AvailableType.AVAILABLE}/${filetype}/${filename}`,
    );

    file.createReadStream().pipe(res);
  }

  async delete(filename: string, filetype: StorageType): Promise<MoveResponse> {
    const file = this.bucket.file(
      `${AvailableType.AVAILABLE}/${filetype}/${filename}`,
    );

    const moveResponse = await file.move(
      `${AvailableType.NOT_AVAILABLE}/${filetype}/${filename}`,
    );
    return moveResponse;
  }

  async restore(
    filename: string,
    filetype: StorageType,
  ): Promise<MoveResponse> {
    const deletedFile = this.bucket.file(
      `${AvailableType.NOT_AVAILABLE}/${filetype}/${filename}`,
    );

    const moveResponse = await deletedFile.move(
      `${AvailableType.AVAILABLE}/${filetype}/${filename}`,
    );
    return moveResponse;
  }
}

export default StorageService;
