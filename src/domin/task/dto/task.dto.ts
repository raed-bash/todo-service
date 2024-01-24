import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { pick } from 'lodash';
import { UserDto } from 'src/domin/user/dto/user.dto';

export class TaskDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  completed!: boolean;

  @ApiProperty()
  user!: UserDto;

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

    this.user = new UserDto(task.user);
  }
}
