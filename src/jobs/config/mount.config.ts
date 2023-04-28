import { join } from 'path';
import ExtensionType from '@jobs/enum/extension-type';

type MountConfig = {
  [key in ExtensionType]: {
    codeDirPath: string;
    inputDirPath: string;
    outputDirPath: string;
  };
};

const mountConfig: MountConfig = {
  [ExtensionType.C]: {
    codeDirPath: join('/', 'mnt', 'codes', 'c'),
    inputDirPath: join('/', 'mnt', 'inputs', 'c'),
    outputDirPath: join('/', 'mnt', 'outputs', 'c'),
  },
  [ExtensionType.CPP]: {
    codeDirPath: join('/', 'mnt', 'codes', 'cpp'),
    inputDirPath: join('/', 'mnt', 'inputs', 'cpp'),
    outputDirPath: join('/', 'mnt', 'outputs', 'cpp'),
  },
  [ExtensionType.PYTHON]: {
    codeDirPath: join('/', 'mnt', 'codes', 'python'),
    inputDirPath: join('/', 'mnt', 'inputs', 'python'),
    outputDirPath: join('/', 'mnt', 'outputs', 'python'),
  },
  [ExtensionType.JAVASCRIPT]: {
    codeDirPath: join('/', 'mnt', 'codes', 'javascript'),
    inputDirPath: join('/', 'mnt', 'inputs', 'javascript'),
    outputDirPath: join('/', 'mnt', 'outputs', 'javascript'),
  },
};

export default mountConfig;
