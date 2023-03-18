import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

class CreateCategoryDto {
  @ApiProperty({
    description: 'Category Title',
    required: true,
  })
  @IsString()
  @MaxLength(255)
  @Type(() => String)
  readonly title: string;
}

export default CreateCategoryDto;
