import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/* Create class Create Material DTO based on the model */
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
  @IsString()
  @IsOptional()
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
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  parentId?: number;
}

export default CreateMaterialDto;
