import { PartialType } from '@nestjs/swagger';
import CreateCategoryDto from '@category/dto/create-category';

class UpdateCategoryContentDto extends PartialType(CreateCategoryDto) {}

export default UpdateCategoryContentDto;
