import { IsNumber, IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import CourseLevel from '@course/enum/course-level';
import IsCourseLevel from '@course/validator/course-level';

class FetchCourseDto {
  @ApiProperty({
    description: 'Category ID',
    type: Number,
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  readonly categoryIDs?: number[];

  @ApiProperty({
    description: 'Course Title',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Type(() => String)
  readonly title?: string;

  @ApiProperty({
    description: 'Course Difficulty',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsCourseLevel()
  @Type(() => String)
  readonly difficulty?: CourseLevel;

  @ApiProperty({
    description: 'Page Limit',
    type: Number,
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  readonly limit: number;

  @ApiProperty({
    description: 'Page Number',
    type: Number,
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  readonly page: number;

  @ApiProperty({
    description: 'Subscribed',
    type: Boolean,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  readonly subscribed?: boolean;
}

export default FetchCourseDto;
