import { PassThrough } from 'stream';
import { Injectable } from '@nestjs/common';
import {
  Bucket,
  DownloadResponse,
  MoveResponse,
  Storage,
} from '@google-cloud/storage';
import { EventEmitter2 } from '@nestjs/event-emitter';
import CloudLogger from '@logger/class/cloud-logger';
import StorageType from '@storage/enum/storage-type';
import AvailableType from '@storage/enum/available-type';
import storageConfig from '@storage/config/storage.config';

@Injectable()
class StorageService {
  private readonly bucket: Bucket;

  constructor(
    private readonly cloudLogger: CloudLogger,
    private readonly eventEmitter: EventEmitter2,
  ) {
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
  ): Promise<void> {
    const passThrough = new PassThrough();
    passThrough.write(content.buffer);
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
  ): Promise<PassThrough> {
    const file = this.bucket.file(
      `${AvailableType.AVAILABLE}/${filetype}/${filename}`,
    );

    const passThrough = new PassThrough();
    file.createReadStream().pipe(passThrough);

    return passThrough;
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
