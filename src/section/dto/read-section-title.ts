import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Type } from 'class-transformer';

class ReadSectionTitleDto {
  @ApiProperty({
    description: 'Section Title',
    required: true,
  })
  @IsString()
  @Type(() => String)
  readonly title: string;
}

export default ReadSectionTitleDto;
