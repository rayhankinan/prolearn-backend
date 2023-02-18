import { ApiProperty } from '@nestjs/swagger';

class ResponseObject<T> {
  @ApiProperty({ description: 'Response Message' })
  message?: string;

  @ApiProperty({ description: 'Response Data' })
  data?: T;

  @ApiProperty({ description: 'Response Meta' })
  meta?: any;
}

export default ResponseObject;
