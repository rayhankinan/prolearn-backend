import { ParseFilePipe, FileTypeValidator } from '@nestjs/common';
import { lookup } from 'mime-types';

const jsonOnlyPipe = new ParseFilePipe({
  validators: [new FileTypeValidator({ fileType: lookup('.json') as string })],
});

export default jsonOnlyPipe;
