import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class CreateMaterialDto {
  @ApiProperty({
    description: 'Section Title',
    required: true,
  })
  @IsString()
  @Type(() => String)
  title: string;

  @ApiProperty({
    description: 'Section Objective',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Type(() => String)
  objective?: string;

  @ApiProperty({
    description: 'Section Duration',
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  duration: number;

  @ApiProperty({
    description: 'Section Parent',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  parentId?: number;
}

export default CreateMaterialDto;
