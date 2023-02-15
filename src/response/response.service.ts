import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Response } from 'express';
import { isNil, isEmpty } from 'lodash';

export class ResponseObject<T> {
  @ApiProperty({ description: 'Response message' })
  message?: string;

  @ApiProperty({ description: 'Response data' })
  data?: T;

  @ApiProperty({ description: 'Response meta' })
  meta?: any;
}

@Injectable()
class ResponseService {
  json<T>(
    res: Response,
    status: number,
    message?: string,
    data?: Record<string, any> | Array<Record<string, any>> | T,
    meta?: any,
  ): void {
    const response: ResponseObject<typeof data> = {};

    response.message = message;

    if (!isNil(data)) {
      response.data = data;
    }

    if (!isNil(meta)) {
      response.meta = meta;
    }

    res.status(status).json(response);
  }
}

export default ResponseService;
