import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginatedQueryDto } from './paginated-query.dto';

class PaginatedMetadata {
  @ApiProperty()
  total!: number;

  @ApiProperty()
  lastPage!: number;

  @ApiProperty()
  currentPage!: number;

  @ApiProperty()
  perPage!: number;

  @ApiPropertyOptional()
  prev!: number;

  @ApiPropertyOptional()
  next!: number;
}

export class PaginatedResultsDto<T> {
  @ApiProperty({ type: Object, isArray: true })
  data: T[];

  @ApiProperty({ type: PaginatedMetadata })
  meta: PaginatedMetadata;

  constructor(data: T[], count: number, query: PaginatedQueryDto) {
    const lastPage = Math.ceil(count / query.perPage);

    this.data = data;

    this.meta = {
      total: count,
      lastPage: lastPage,
      currentPage: query.page,
      perPage: query.perPage,
      prev: query.page > 1 ? query.page - 1 : undefined,
      next: query.page < lastPage ? query.page + 1 : undefined,
    };
  }
}
