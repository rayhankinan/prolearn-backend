import { ParseFilePipe, FileTypeValidator } from '@nestjs/common';
import { lookup } from 'mime-types';

const htmlOnlyPipe = new ParseFilePipe({
  validators: [new FileTypeValidator({ fileType: lookup('.html') as string })],
});

export default htmlOnlyPipe;
