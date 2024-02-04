import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Roles } from '@prisma/client';
import { pick } from 'lodash';
export class UserDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  username!: string;

  @ApiProperty({ enum: Roles })
  role!: Roles;

  @ApiProperty()
  locked!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiPropertyOptional()
  updatedAt?: Date | null;

  constructor(user: UserDto) {
    Object.assign(
      this,
      pick(user, [
        'id',
        'username',
        'role',
        'locked',
        'createdAt',
        'updatedAt',
      ]),
    );
  }
}
