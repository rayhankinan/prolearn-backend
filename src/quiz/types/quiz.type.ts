import { IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import QuestionType from '@quiz/types/question.type';

class QuizType {
  @ApiProperty({
    description: 'Quiz Title',
    required: true,
  })
  @IsString()
  @Type(() => String)
  title: string;

  @ApiProperty({
    description: 'Quiz Content',
    required: true,
  })
  @IsString()
  @Type(() => String)
  content: string;

  @ApiProperty({
    description: 'Quiz Questions',
    isArray: true,
    required: true,
  })
  @ValidateNested({ each: true })
  @Type(() => QuestionType)
  questions: QuestionType[];
}

export default QuizType;
