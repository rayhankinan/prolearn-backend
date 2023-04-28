import { IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import RatingBound from '@rating/type/rating-bound';

class CreateRatingDto {
  @ApiProperty({
    description: 'Rating value',
    type: Number,
    required: true,
  })
  @IsNumber()
  @Min(RatingBound.MIN)
  @Max(RatingBound.MAX)
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
