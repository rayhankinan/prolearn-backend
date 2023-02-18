import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Type } from 'class-transformer';

class CreateFileDto {
  @ApiProperty({
    description: 'File Name',
    required: true,
  })
  @IsString()
  @Type(() => String)
  readonly name: string;
}

export default CreateFileDto;
