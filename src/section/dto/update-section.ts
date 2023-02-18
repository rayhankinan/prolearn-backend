import { PartialType } from '@nestjs/swagger';
import CreateSectionDto from './material/create-material';

class UpdateSectionDto extends PartialType(CreateSectionDto) {}

export default UpdateSectionDto;
