import { ApiProperty } from '@nestjs/swagger';

class ResponsePagination<T> {
  @ApiProperty({ description: 'Pagination Result' })
  list: T[];

  @ApiProperty({ description: 'Count All Result' })
  count: number;

  @ApiProperty({ description: 'Current Page' })
  currentPage: number;

  @ApiProperty({ description: 'Total Page' })
  totalPage: number;
}

export default ResponsePagination;
