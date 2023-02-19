import { ParseFilePipe, FileTypeValidator } from '@nestjs/common';

const imageOnlyPipe = new ParseFilePipe({
  validators: [new FileTypeValidator({ fileType: /image\/(.*)/ })],
});

export default imageOnlyPipe;
