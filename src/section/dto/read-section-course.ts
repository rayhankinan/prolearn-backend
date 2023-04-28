import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class ReadSectionCourseDto {
  @ApiProperty({
    description: 'Course ID',
    type: Number,
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  readonly courseId: number;
}

export default ReadSectionCourseDto;
