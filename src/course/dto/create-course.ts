import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import CourseLevel from '@course/enum/course-level';
import CourseStatus from '@course/enum/course-status';
import IsCourseLevel from '@course/validator/course-level';
import IsCourseStatus from '@course/validator/course-status';
import CreateSectionDto from '@section/dto/create-material';

class CreateCourseDto {
  @ApiProperty({
    description: 'Course Title',
    required: true,
  })
  @IsString()
  @Type(() => String)
  title: string;

  @ApiProperty({
    description: 'Course Description',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Type(() => String)
  description?: string;

  @ApiProperty({
    description: 'Course Difficulty',
    required: true,
  })
  @IsCourseLevel()
  @Type(() => String)
  difficulty: CourseLevel;

  @ApiProperty({
    description: 'Course Category',
    isArray: true,
    required: false,
  })
  @IsNumber({}, { each: true })
  @IsOptional()
  @Type(() => Number)
  category?: number[];

  @ApiProperty({
    description: 'Course Status',
    required: true,
  })
  @IsCourseStatus()
  @Type(() => String)
  status: CourseStatus;

  @ApiProperty({
    description: 'Course Section',
    isArray: true,
    required: false,
  })
  @IsOptional()
  @Type(() => CreateSectionDto)
  section?: CreateSectionDto[];
}

export default CreateCourseDto;
