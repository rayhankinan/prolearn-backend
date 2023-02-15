import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class DeleteCategoryDto {
  @ApiProperty({
    description: 'Category id',
    required: true,
  })
  @IsNumber()
  readonly id: number;
}

export default DeleteCategoryDto;
