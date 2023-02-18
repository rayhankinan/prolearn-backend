import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { isNil } from 'lodash';
import ResponseObject from '@response/class/response-object';

@Injectable()
class ResponseService {
  json<T>(
    res: Response,
    status: number,
    message?: string,
    data?: Record<string, T> | Array<Record<string, T>> | T,
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
