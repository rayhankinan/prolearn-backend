import { PartialType } from '@nestjs/swagger';
import CreateCourseDto from './create-course';

class UpdateCourseDto extends PartialType(CreateCourseDto) {}

export default UpdateCourseDto;