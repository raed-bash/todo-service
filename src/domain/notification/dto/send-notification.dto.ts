import { ApiProperty } from '@nestjs/swagger';
import { Roles } from '@prisma/client';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class SendNotificationDto {
  @ApiProperty({ isArray: true })
  @IsNumber({}, { each: true })
  userIds!: number[];

  @ApiProperty()
  @Length(2)
  @IsString()
  title!: string;

  @ApiProperty()
  @Length(2)
  @IsString()
  body!: string;

  @ApiProperty({ enum: Roles })
  @IsOptional()
  @IsEnum(Roles)
  role?: Roles;
}
