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
  readonly title: string;

  @ApiProperty({
    description: 'Section Objective',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Type(() => String)
  readonly objective?: string;

  @ApiProperty({
    description: 'Section Duration',
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  readonly duration: number;

  @ApiProperty({
    description: 'Section Parent',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly parentId?: number;

  @ApiProperty({
    description: 'Section Adjoined Course',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly adjoinedCourseId?: number;
}

export default CreateMaterialDto;
