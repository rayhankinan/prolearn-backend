import { Injectable } from '@nestjs/common';
import { Bucket, DownloadResponse, Storage } from '@google-cloud/storage';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import CloudLogger from '@logger/class/cloud-logger';
import StorageType from '@storage/enum/storage-type';
import AvailableType from '@storage/enum/available-type';
import storageConfig from '@storage/config/storage.config';
import UploadPayload from '@storage/payload/upload-payload';
import DeletePayload from '@storage/payload/delete-payload';
import RestorePayload from '@storage/payload/restore-payload';

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
    const payload: UploadPayload = {
      filename,
      filetype,
      content,
    };

    await this.eventEmitter.emitAsync('file.uploaded', payload);
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
    const payload: DeletePayload = { filename, filetype };

    await this.eventEmitter.emitAsync('file.deleted', payload);
  }

  async restore(filename: string, filetype: StorageType): Promise<void> {
    const payload: RestorePayload = { filename, filetype };

    await this.eventEmitter.emitAsync('file.restored', payload);
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
  async restoreHandler(payload: RestorePayload) {
    const { filename, filetype } = payload;
    const file = this.bucket.file(
      `${AvailableType.NOT_AVAILABLE}/${filetype}/${filename}`,
    );

    await file.move(`${AvailableType.AVAILABLE}/${filetype}/${filename}`);
  }
}

export default StorageService;
