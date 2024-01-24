import { ApiProperty } from '@nestjs/swagger';
import { Roles } from '@prisma/client';
import { IsEnum, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @Length(3, 100)
  username!: string;

  @ApiProperty()
  @IsString()
  @Length(8, 200)
  password!: string;

  @ApiProperty({ enum: Roles })
  @IsEnum(Roles)
  role!: Roles;
}
