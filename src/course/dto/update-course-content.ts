import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import CourseLevel from '@course/enum/course-level';
import CourseStatus from '@course/enum/course-status';
import IsCourseLevel from '@course/validator/course-level';
import IsCourseStatus from '@course/validator/course-status';

class UpdateCourseDto {
  @ApiProperty({
    description: 'Course Title',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Type(() => String)
  readonly title: string;

  @ApiProperty({
    description: 'Course Description',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Type(() => String)
  readonly description?: string;

  @ApiProperty({
    description: 'Course Difficulty',
    required: true,
  })
  @IsCourseLevel()
  @Type(() => String)
  readonly difficulty: CourseLevel;

  @ApiProperty({
    description: 'Course Category',
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  readonly categoryIDs?: number[];

  @ApiProperty({
    description: 'Course Status',
    required: true,
  })
  @IsCourseStatus()
  @Type(() => String)
  readonly status: CourseStatus;
}

export default UpdateCourseDto;
