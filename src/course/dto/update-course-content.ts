import { PartialType } from '@nestjs/swagger';
import CreateCourseDto from '@course/dto/create-course';

class UpdateCourseDto extends PartialType(CreateCourseDto) {}

export default UpdateCourseDto;
