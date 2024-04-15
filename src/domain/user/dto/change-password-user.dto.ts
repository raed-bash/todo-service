import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Length } from 'class-validator';

export class ChangePasswordUserDto {
  @ApiProperty()
  @IsInt()
  id!: number;

  @ApiProperty()
  @IsString()
  @Length(8, 200)
  password!: string;
}
