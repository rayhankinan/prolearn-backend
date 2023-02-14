import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteCategoryDto {
  @ApiProperty({ 
    description: 'Category id',
    required: true,
  })
  @IsNumber()
  readonly id: number
}