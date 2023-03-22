import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class AnswerType {
  @ApiProperty({
    description: 'Answer Content',
    required: true,
  })
  @IsString()
  @Type(() => String)
  content: string;

  @ApiProperty({
    description: 'Answer Options',
    isArray: true,
    required: true,
  })
  @IsNumber({}, { each: true })
  @Type(() => String)
  options: number[];
}

export default AnswerType;