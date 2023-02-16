import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import CourseLevel from '@course/enum/course-level';
import CourseStatus from '@course/enum/course-status';
import { IsCourseLevel, IsCourseStatus } from '@course/validator/course-validator';
import CreateSectionDto from '@section/dto/create-section';

//create class Create Course DTO based on the model
class CreateCourseDto {
  @ApiProperty({
    description: 'Course title',
    required: true,
  })
  @IsString()
  @Type(() => String)
  title: string;

  @ApiProperty({
    description: 'Course description',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Type(() => String)
  description: string;

  @ApiProperty({
    description: 'Course difficulty',
    required: true,
  })
  @IsCourseLevel()
  difficulty: CourseLevel;

  @ApiProperty({
    description: 'Course category',
    isArray: true,
    required: false,
  })
  @IsNumber({},{each: true})
  @IsOptional()
  @Type(() => Number)
  category: number[];

  @ApiProperty({
    description: 'Course status',
    required: true,
  })
  @IsCourseStatus()
  @Type(() => String)
  status: CourseStatus;

  @ApiProperty({
    description: 'Course section',
    isArray: true,
    required: false,
  })
  @IsOptional()
  @Type(() => CreateSectionDto)
  section: CreateSectionDto[];
}

export default CreateCourseDto;
