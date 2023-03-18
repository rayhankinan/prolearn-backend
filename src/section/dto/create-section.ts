import {
  IsString,
  IsNumber,
  IsOptional,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import QuizType from '@quiz/types/quiz.type';

class CreateSectionDto {
  @ApiProperty({
    description: 'Section Title',
    required: true,
  })
  @IsString()
  @MaxLength(255)
  @Type(() => String)
  readonly title: string;

  @ApiProperty({
    description: 'Section Objective',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Type(() => String)
  readonly objective?: string;

  @ApiProperty({
    description: 'Section Duration',
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  readonly duration: number;

  @ApiProperty({
    description: 'Section Course ID',
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  readonly courseId: number;

  @ApiProperty({
    description: 'Section Quiz Content',
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  readonly quizContent?: QuizType;
}

export default CreateSectionDto;
