import { ParseFilePipe, FileTypeValidator } from '@nestjs/common';
import { lookup } from 'mime-types';

const mp4OnlyPipe = new ParseFilePipe({
  validators: [new FileTypeValidator({ fileType: lookup('.mp4') as string })],
});

export default mp4OnlyPipe;
