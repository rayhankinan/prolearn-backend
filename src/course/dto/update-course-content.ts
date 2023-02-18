import { PartialType } from '@nestjs/swagger';
import CreateCourseDto from '@course/dto/create-course';

class UpdateCourseContentDto extends PartialType(CreateCourseDto) {}

export default UpdateCourseContentDto;
