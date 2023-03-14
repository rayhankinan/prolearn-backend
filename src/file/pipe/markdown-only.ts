import { ParseFilePipe, FileTypeValidator } from '@nestjs/common';
import { lookup } from 'mime-types';

const markdownOnlyPipe = new ParseFilePipe({
  validators: [new FileTypeValidator({ fileType: lookup('.md') as string })],
});

export default markdownOnlyPipe;
