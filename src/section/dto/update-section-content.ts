import { PartialType } from '@nestjs/swagger';
import CreateSectionDto from '@section/dto/create-section';

class UpdateSectionContentDto extends PartialType(CreateSectionDto) {}

export default UpdateSectionContentDto;
