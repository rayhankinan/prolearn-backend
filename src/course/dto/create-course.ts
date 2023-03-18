import { IsString, IsNumber, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import CourseLevel from '@course/enum/course-level';
import CourseStatus from '@course/enum/course-status';
import IsCourseLevel from '@course/validator/course-level';
import IsCourseStatus from '@course/validator/course-status';

class CreateCourseDto {
  @ApiProperty({
    description: 'Course Title',
    required: true,
  })
  @IsString()
  @MaxLength(255)
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
    required: false,
  })
  @IsOptional()
  @IsCourseLevel()
  @Type(() => String)
  readonly difficulty?: CourseLevel;

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
    required: false,
  })
  @IsOptional()
  @IsCourseStatus()
  @Type(() => String)
  readonly status?: CourseStatus;
}

export default CreateCourseDto;
