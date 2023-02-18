import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class ReadCourseIDDto {
  @ApiProperty({
    description: 'Course ID',
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  readonly id: number;
}

export default ReadCourseIDDto;
