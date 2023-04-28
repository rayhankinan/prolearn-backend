import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Type } from 'class-transformer';

class ReadFileNameDto {
  @ApiProperty({
    description: 'File Name',
    type: String,
    required: true,
  })
  @IsString()
  @Type(() => String)
  readonly name: string;
}

export default ReadFileNameDto;
