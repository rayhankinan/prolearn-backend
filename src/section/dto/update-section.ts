import { PartialType } from '@nestjs/swagger';
import CreateSectionDto from './create-section';

class UpdateSectionDto extends PartialType(CreateSectionDto) {}

export default UpdateSectionDto;
