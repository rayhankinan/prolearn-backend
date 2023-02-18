import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class DeleteSectionDto {
  @ApiProperty({
    description: 'Section id',
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  id: number;
}

export default DeleteSectionDto;