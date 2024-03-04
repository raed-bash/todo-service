import { ApiPropertyOptional } from '@nestjs/swagger';
import { Roles } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { IsBooleanFilter } from 'src/common/decorators/query-filters/boolean-filter.decorator';
import {
  IsOrderAttribute,
  OrderedPaginatedQueryDto,
  OrderedQueryDto,
} from 'src/common/dto/orderd-paginated-query.dto';

const orderAttributes = [
  'id',
  'username',
  'locked',
  'role',
  'createdAt',
  'updatedAt',
] as const;

type OrderAttributes = (typeof orderAttributes)[number];

export class QueryUserDto
  extends OrderedPaginatedQueryDto
  implements OrderedQueryDto
{
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  username?: string;

  @IsBooleanFilter()
  locked?: boolean;

  @ApiPropertyOptional({ enum: Roles })
  @IsEnum(Roles)
  @IsOptional()
  role?: Roles;

  @IsOrderAttribute(orderAttributes)
  orderBy: OrderAttributes = 'id';
}
