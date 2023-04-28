import { ApiProperty } from '@nestjs/swagger';
import ResponseObject from '@response/class/response-object';

class ResponsePaginationMeta {
  @ApiProperty({ description: 'Count All Result' })
  count: number;

  @ApiProperty({ description: 'Current Page' })
  currentPage: number;

  @ApiProperty({ description: 'Total Page' })
  totalPage: number;

  constructor(count: number, currentPage: number, totalPage: number) {
    this.count = count;
    this.currentPage = currentPage;
    this.totalPage = totalPage;
  }
}

class ResponsePagination<T> extends ResponseObject<T[]> {
  constructor(
    message: string,
    data: T[],
    count: number,
    currentPage: number,
    totalPage: number,
  ) {
    const responsePaginationMeta = new ResponsePaginationMeta(
      count,
      currentPage,
      totalPage,
    );

    super(message, data, responsePaginationMeta);
  }
}

export default ResponsePagination;
