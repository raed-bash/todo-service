import { applyDecorators } from '@nestjs/common';
import { PaginatedQueryDto } from './paginated-query.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';

const orderDirds = ['asc', 'desc'] as const;

export type OrderDir = (typeof orderDirds)[number];

export const IsOrderDirection = () =>
  applyDecorators(
    ApiPropertyOptional({ enum: orderDirds }),
    IsOptional(),
    IsIn(orderDirds),
  );

export const IsOrderAttribute = (attributes: readonly string[]) =>
  applyDecorators(
    ApiPropertyOptional({ enum: attributes }),
    IsOptional(),
    IsIn(attributes),
  );

export class OrderedPaginatedQueryDto extends PaginatedQueryDto {
  @IsOrderDirection()
  orderDir: OrderDir = 'desc';
}

export interface OrderedQueryDto {
  orderBy: string;
  orderDir: OrderDir;
}
