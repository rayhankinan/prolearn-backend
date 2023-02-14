import { Injectable,  } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Response } from 'express';
import { get, isNil, isEmpty } from 'lodash';

export class ResponseObject<T> {
  @ApiProperty({ description: 'Error code' })
  code?: string;

  @ApiProperty({ description: 'Response message' })
  message?: string;

  @ApiProperty({ description: 'Response data' })
  data?: T;

  @ApiProperty({ description: 'Response meta' })
  meta?: any;
}

const defaultStatus = 400;

@Injectable()
export class ResponseService {
  json<T>(
    res: Response,
    statusOrError: number | Error,
    message?: string,
    data?: Record<string, any> | Array<Record<string, any>> | T,
    meta?: any,
    code?: string,
  ): void {
    const error = statusOrError instanceof Error ? statusOrError : null;

    const response: ResponseObject<typeof data> = {};
    response.message = message;

    let status = statusOrError;

    if (error) {
      const errorObj = statusOrError as Error;
      response.message = message || errorObj.message;
      status = get(errorObj, 'status', defaultStatus);
    }

    if (!isNil(data)) {
      response.data = data;
    }

    if (!isNil(meta)) {
      response.meta = meta;
    }

    if (!isEmpty(code)) {
      response.code = code;
    }

    const statusCode = status as number;

    res.status(statusCode).json(response);
  }
}