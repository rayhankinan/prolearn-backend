import { ApiProperty } from '@nestjs/swagger';

class ResponseObject<T> {
  @ApiProperty({ description: 'Response Message' })
  readonly message: string;

  @ApiProperty({ description: 'Response Data' })
  readonly data: Record<string, T> | Array<Record<string, T>> | T;

  @ApiProperty({ description: 'Response Meta' })
  readonly meta?: object;

  constructor(message: string, data: T, meta?: object) {
    this.message = message;
    this.data = data;
    this.meta = meta;
  }
}

export default ResponseObject;
