import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { QueryTaskDto } from './query-task.dto';
import { Transform } from 'class-transformer';

export class AllQueryTaskDto extends QueryTaskDto {
  @ApiPropertyOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsOptional()
  userId?: number;
}
