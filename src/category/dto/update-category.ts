import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiProperty({ 
    description: 'Category title',
    required: true,
  })
  @IsString()
  readonly title: string;

  @ApiProperty({
    description: 'Category id',
    required: true,
  })
  @IsNumber()
  readonly id: number;
}