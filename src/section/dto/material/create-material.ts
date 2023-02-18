import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class CreateMaterialDto {
  @ApiProperty({
    description: 'Section title',
    required: true,
  })
  @IsString()
  @Type(() => String)
  title: string;

  @ApiProperty({
    description: 'Section objective',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Type(() => String)
  objective?: string;

  @ApiProperty({
    description: 'Section duration',
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  duration: number;

  @ApiProperty({
    description: 'Section parent',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  parentId?: number;
}

export default CreateMaterialDto;
