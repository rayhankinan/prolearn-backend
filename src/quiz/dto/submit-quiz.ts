import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class SubmitQuizDto {
  @ApiProperty({
    description: 'Quiz Answer',
    type: Number,
    isArray: true,
    required: true,
  })
  @IsNumber({}, { each: true })
  @Type(() => Number)
  readonly answer: number[];
}

export default SubmitQuizDto;
