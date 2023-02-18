import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

class RenderMaterial {
  @ApiProperty({
    description: 'File Name',
    required: true,
  })
  @IsUUID()
  @Type(() => String)
  uuid: string;
}

export default RenderMaterial;
