import { PartialType } from '@nestjs/swagger';
import CreateFileDto from '@file/dto/create-file';

class UpdateFileContentDto extends PartialType(CreateFileDto) {}

export default UpdateFileContentDto;
