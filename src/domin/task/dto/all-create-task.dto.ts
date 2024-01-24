import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { CreateTaskDto } from './create-task.dto';

export class AllCreateTaskDto extends CreateTaskDto {
  @ApiProperty()
  @IsInt()
  userId!: number;
}
