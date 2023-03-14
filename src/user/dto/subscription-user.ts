import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class SubscriptionUserDTO {
  @ApiProperty({
    description: 'Course ID',
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  readonly courseId: number;
}

export default SubscriptionUserDTO;
