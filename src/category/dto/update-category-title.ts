import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class UpdateCategoryTitleDto {
  @ApiProperty({
    description: 'Category title',
    required: true,
  })
  @IsString()
  @Type(() => String)
  readonly title: string;
}

export default UpdateCategoryTitleDto;
