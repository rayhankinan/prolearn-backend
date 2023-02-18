import { PartialType } from '@nestjs/swagger';
import CreateMaterialDto from '@section/dto/material/create-material';

class UpdateMaterialContentDto extends PartialType(CreateMaterialDto) {}

export default UpdateMaterialContentDto;
