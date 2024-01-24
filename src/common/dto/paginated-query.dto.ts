import { applyDecorators } from '@nestjs/common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export const IsOptionalPageParam = (options?: { minValue?: number }) =>
  applyDecorators(
    ApiPropertyOptional(),
    Type(() => Number),
    IsInt(),
    Min(options?.minValue ?? 1),
    IsOptional(),
  );

export const IsOptionalPerPageParam = (options?: {
  minValue?: number;
  maxValue?: number;
}) =>
  applyDecorators(
    ApiPropertyOptional(),
    Type(() => Number),
    IsInt(),
    Min(options?.minValue ?? 1),
    Max(options?.maxValue ?? 100),
    IsOptional(),
  );

export class PaginatedQueryDto {
  @IsOptionalPageParam()
  page: number = 1;

  @IsOptionalPerPageParam()
  perPage: number = 10;
}
