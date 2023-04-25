import { IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class CreateRatingDto {
  @ApiProperty({
    description: 'Rating value',
    type: Number,
    required: true,
  })
  @IsNumber()
  @Min(0.0)
  @Max(5.0)
  @Type(() => Number)
  readonly rating: number;

  @ApiProperty({
    description: 'Course ID',
    type: Number,
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  readonly courseId: number;
}

export default CreateRatingDto;
