import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class ReadFileIDDto {
  @ApiProperty({
    description: 'File ID',
    type: Number,
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  readonly id: number;
}

export default ReadFileIDDto;
