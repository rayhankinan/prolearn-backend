import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class UpdateCategoryIDDto {
  @ApiProperty({
    description: 'Category id',
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  readonly id: number;
}

export default UpdateCategoryIDDto;
