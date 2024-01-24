import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class AuthDto {
  @ApiProperty()
  @IsString()
  @Length(3, 100)
  username!: string;

  @ApiProperty()
  @IsString()
  @Length(8, 200)
  password!: string;
}
