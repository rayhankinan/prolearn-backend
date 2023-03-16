import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import IsFileType from '@file/validator/file-type';
import StorageType from '@storage/enum/storage-type';

class RenderFileDto {
  @ApiProperty({
    description: 'File Type',
    required: true,
  })
  @IsFileType()
  @Type(() => String)
  readonly type: StorageType;

  @ApiProperty({
    description: 'File ID',
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  readonly id: number;
}

export default RenderFileDto;
