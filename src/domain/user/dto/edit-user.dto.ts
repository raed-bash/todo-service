import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Roles } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class EditUserDto {
  @ApiProperty()
  @IsNumber()
  id!: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  locked?: boolean;

  @ApiPropertyOptional({ enum: Roles })
  @IsEnum(Roles)
  @IsOptional()
  role?: Roles;

  @ApiPropertyOptional()
  @IsString()
  @Length(3, 100)
  @IsOptional()
  username?: string;
}
