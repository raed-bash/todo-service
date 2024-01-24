import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty()
  @IsString()
  @Length(4, 200)
  title!: string;
}
