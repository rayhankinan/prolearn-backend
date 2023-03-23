import {
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import AnswerType from '@quiz/types/answer.type';

class SubmitQuizDto {
  @ApiProperty({
    description: 'Quiz ID',
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  readonly quizId: number;

  @ApiProperty({
    description: 'Quiz Answer',
    required: true,
  })
  @ValidateNested()
  @Type(() => AnswerType)
  readonly answer: AnswerType;
}

export default SubmitQuizDto;
