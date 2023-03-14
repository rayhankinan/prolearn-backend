import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class UpdateCategoryIDDto {
  @ApiProperty({
    description: 'Category ID',
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  readonly id: number;
}

export default UpdateCategoryIDDto;
