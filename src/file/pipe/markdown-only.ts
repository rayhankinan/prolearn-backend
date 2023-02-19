import { ParseFilePipe, FileTypeValidator } from '@nestjs/common';

const markdownOnlyPipe = new ParseFilePipe({
  validators: [new FileTypeValidator({ fileType: 'text/x-markdown' })],
});

export default markdownOnlyPipe;
