import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { pick } from 'lodash';

export class TaskDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  completed!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiPropertyOptional()
  updatedAt?: Date | null;

  @ApiPropertyOptional()
  removedAt?: Date | null;

  constructor(task: TaskDto) {
    Object.assign(
      this,
      pick(task, [
        'id',
        'title',
        'completed',
        'createdAt',
        'updatedAt',
        'removedAt',
      ]),
    );
  }
}
