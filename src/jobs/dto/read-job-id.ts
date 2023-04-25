import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class ReadJobIDDto {
  @ApiProperty({
    description: 'Job ID',
    type: Number,
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  readonly id: number;
}

export default ReadJobIDDto;
