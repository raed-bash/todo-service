import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class EditTaskDto {
  @ApiProperty()
  @IsNumber()
  id!: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  completed?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @Length(3, 100)
  @IsOptional()
  title?: string;
}
