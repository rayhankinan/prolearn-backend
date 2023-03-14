import ResponseObject from '@response/class/response-object';

class ResponseList<T> extends ResponseObject<T[]> {
  constructor(message: string, data: T[], meta?: object) {
    super(message, data, meta);
  }
}

export default ResponseList;
