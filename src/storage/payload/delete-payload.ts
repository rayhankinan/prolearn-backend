import StorageType from '@storage/enum/storage-type';

interface DeletePayload {
  filename: string;
  filetype: StorageType;
}

export default DeletePayload;
