import { applyDecorators } from '@nestjs/common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { booleanStrTransform } from 'src/common/utils/booleanStrTransform.util';

export const IsBooleanFilter = () =>
  applyDecorators(
    ApiPropertyOptional(),
    Transform(({ value }) => booleanStrTransform(value)),
    IsBoolean(),
    IsOptional(),
  );
