import { ApiPropertyOptional } from '@nestjs/swagger';
import { Task } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';
import { IsBooleanFilter } from 'src/common/decorators/query-filters/boolean-filter.decorator';
import {
  IsOrderAttribute,
  OrderedPaginatedQueryDto,
  OrderedQueryDto,
} from 'src/common/dto/orderd-paginated-query.dto';

const orderAttributes: (keyof Task)[] = [
  'id',
  'title',
  'completed',
  'createdAt',
  'updatedAt',
  'removedAt',
] as const;

type OrderAttributes = (typeof orderAttributes)[number];

export class QueryTaskDto
  extends OrderedPaginatedQueryDto
  implements OrderedQueryDto
{
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

  @IsOrderAttribute(orderAttributes)
  orderBy: OrderAttributes = 'id';
}
