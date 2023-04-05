import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class ViewHistoryDto {
  @ApiProperty({
    description: 'Quiz ID',
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  readonly quizId: number;
}

export default ViewHistoryDto;
