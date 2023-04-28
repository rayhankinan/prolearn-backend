import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Type } from 'class-transformer';

class ReadCategoryTitleDto {
  @ApiProperty({
    description: 'Category Title',
    type: String,
    required: true,
  })
  @IsString()
  @Type(() => String)
  readonly title: string;
}

export default ReadCategoryTitleDto;
