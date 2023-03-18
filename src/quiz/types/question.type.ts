import { IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import OptionType from '@quiz/types/option.type';

class QuestionType {
  @ApiProperty({
    description: 'Question Content',
    required: true,
  })
  @IsString()
  @Type(() => String)
  content: string;

  @ApiProperty({
    description: 'Question Options',
    isArray: true,
    required: true,
  })
  @ValidateNested({ each: true })
  @Type(() => OptionType)
  options: OptionType[];
}

export default QuestionType;
