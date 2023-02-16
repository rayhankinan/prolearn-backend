//create section dto

import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import SectionType from 'src/section/enum/section-type';
import { IsSectionType } from 'src/section/validator/section-validator';

//create class Create Section DTO based on the model
class CreateSectionDto {
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
  @Type(() => String)
  objective: string;

  @ApiProperty({
    description: 'Section duration',
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  duration: number;

  @ApiProperty({
    description: 'Section type',
    required: true,
  })
  @IsSectionType()
  @Type(() => String)
  type: SectionType;

  @ApiProperty({
    description: 'Section linkToMarkdown',
    required: false,
  })
  @IsString()
  @Type(() => String)
  linkToMarkdown: string;

  @ApiProperty({
    description: 'Section parent',
    required: false,
  })
  @IsNumber()
  @Type(() => Number)
  parent: number;
}

export default CreateSectionDto;