import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class CreateSectionDto {
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
    description: 'Section Course ID',
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  readonly courseId: number;

  @ApiProperty({
    description: 'Section Ancestor',
    required: true,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Boolean)
  readonly isAncestor: boolean;
}

export default CreateSectionDto;
