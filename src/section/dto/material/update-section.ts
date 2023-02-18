import { PartialType } from '@nestjs/swagger';
import CreateMaterialDto from '@section/dto/material/create-material';

class UpdateSectionDto extends PartialType(CreateMaterialDto) {}

export default UpdateSectionDto;
