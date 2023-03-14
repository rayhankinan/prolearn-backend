import StorageType from '@storage/enum/storage-type';

interface RestorePayload {
  filename: string;
  filetype: StorageType;
}

export default RestorePayload;
