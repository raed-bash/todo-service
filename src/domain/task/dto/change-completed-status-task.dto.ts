import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt } from 'class-validator';

export class ChangeCompletedStatusTaskDto {
  @ApiProperty()
  @IsInt()
  id!: number;

  @ApiProperty()
  @IsBoolean()
  completed!: boolean;
}
