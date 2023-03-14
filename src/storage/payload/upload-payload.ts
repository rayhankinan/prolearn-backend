import StorageType from '@storage/enum/storage-type';

interface UploadPayload {
  filename: string;
  filetype: StorageType;
  content: Express.Multer.File;
}

export default UploadPayload;
