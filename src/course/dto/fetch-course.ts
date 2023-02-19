import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import CourseLevel from '@course/enum/course-level';
import IsCourseLevel from '@course/validator/course-level';

class FetchCourseDto {
  @ApiProperty({
    description: 'Category ID',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly categoryId?: number;

  @ApiProperty({
    description: 'Course Title',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Type(() => String)
  readonly title?: string;

  @ApiProperty({
    description: 'Course Difficulty',
    required: false,
  })
  @IsOptional()
  @IsCourseLevel()
  @Type(() => String)
  readonly difficulty?: CourseLevel;

  @ApiProperty({
    description: 'Page Limit',
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  readonly limit: number;

  @ApiProperty({
    description: 'Page Number',
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  readonly page: number;
}

export default FetchCourseDto;
