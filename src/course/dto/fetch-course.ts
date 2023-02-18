import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import CourseLevel from '@course/enum/course-level';
import IsCourseLevel from '@course/validator/course-level';

class FetchCourseDto {
  @ApiProperty({
    description: 'Category ID',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  categoryId?: number;

  @ApiProperty({
    description: 'Course Title',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => String)
  title?: string;

  @ApiProperty({
    description: 'Course Difficulty',
    required: false,
  })
  @IsCourseLevel()
  @IsOptional()
  @Type(() => String)
  difficulty?: CourseLevel;

  @ApiProperty({
    description: 'Page Limit',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @ApiProperty({
    description: 'Page Number',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page?: number;
}

export default FetchCourseDto;
