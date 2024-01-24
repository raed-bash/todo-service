import { ApiPropertyOptional } from '@nestjs/swagger';
import { Roles } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { IsBooleanFilter } from 'src/common/decorators/query-filters/boolean-filter.decorator';
import { PaginatedQueryDto } from 'src/common/dto/paginated-query.dto';

export class QueryUserDto extends PaginatedQueryDto {
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
}
