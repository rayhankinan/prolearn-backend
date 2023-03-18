import { IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class OptionType {
  @ApiProperty({
    description: 'Option Content',
    required: true,
  })
  @IsString()
  @Type(() => String)
  content: string;

  @ApiProperty({
    description: 'Is Option Correct',
    required: true,
  })
  @IsBoolean()
  @Type(() => Boolean)
  isCorrect: boolean;
}

export default OptionType;
