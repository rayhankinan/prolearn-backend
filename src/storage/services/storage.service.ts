import { PassThrough } from 'stream';
import { Injectable } from '@nestjs/common';
import {
  Bucket,
  DownloadResponse,
  MoveResponse,
  Storage,
} from '@google-cloud/storage';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import CloudLogger from '@logger/class/cloud-logger';
import StorageType from '@storage/enum/storage-type';
import AvailableType from '@storage/enum/available-type';
import storageConfig from '@storage/config/storage.config';
import UploadPayload from '@storage/payload/upload-payload';
import DeletePayload from '@storage/payload/delete-payload';

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
    await this.eventEmitter.emitAsync('file.uploaded', {
      filename,
      filetype,
      content,
    });
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

  async delete(filename: string, filetype: StorageType): Promise<void> {
    await this.eventEmitter.emitAsync('file.deleted', { filename, filetype });
  }

  async restore(filename: string, filetype: StorageType): Promise<void> {
    await this.eventEmitter.emitAsync('file.restored', { filename, filetype });
  }

  @OnEvent('file.uploaded', { async: true })
  async uploadHandler(payload: UploadPayload) {
    const { filename, filetype, content } = payload;

    const file = this.bucket.file(
      `${AvailableType.AVAILABLE}/${filetype}/${filename}`,
    );

    await file.save(content.buffer, { contentType: content.mimetype });
  }

  @OnEvent('file.deleted', { async: true })
  async deleteHandler(payload: DeletePayload) {
    const { filename, filetype } = payload;

    const file = this.bucket.file(
      `${AvailableType.AVAILABLE}/${filetype}/${filename}`,
    );

    await file.move(`${AvailableType.NOT_AVAILABLE}/${filetype}/${filename}`);
  }

  @OnEvent('file.restored', { async: true })
  async restoreHandler(payload: DeletePayload) {
    const { filename, filetype } = payload;

    const file = this.bucket.file(
      `${AvailableType.NOT_AVAILABLE}/${filetype}/${filename}`,
    );

    await file.move(`${AvailableType.AVAILABLE}/${filetype}/${filename}`);
  }
}

export default StorageService;
