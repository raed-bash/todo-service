import { ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsDate, IsInt, IsOptional, IsString } from 'class-validator';
import {
  IsOrderAttribute,
  OrderedPaginatedQueryDto,
  OrderedQueryDto,
} from 'src/common/dto/orderd-paginated-query.dto';

const orderAttributes = ['id'] as const;

type OrderAttributes = (typeof orderAttributes)[number];

export class QueryNotificationDto
  extends OrderedPaginatedQueryDto
  implements OrderedQueryDto
{
  @ApiPropertyOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsOptional()
  userId?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  body?: string;

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
