import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';
import { IsBooleanFilter } from 'src/common/decorators/query-filters/boolean-filter.decorator';
import { PaginatedQueryDto } from 'src/common/dto/paginated-query.dto';

export class QueryTaskDto extends PaginatedQueryDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;

  @IsBooleanFilter()
  completed?: boolean;

  @ApiPropertyOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  fromDate?: Date;

  @ApiPropertyOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  toDate?: Date;
}
