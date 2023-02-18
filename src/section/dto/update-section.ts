import { PartialType } from '@nestjs/swagger';
import CreateSectionDto from './create-material';

class UpdateSectionDto extends PartialType(CreateSectionDto) {}

export default UpdateSectionDto;
