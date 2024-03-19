import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt } from 'class-validator';

export class ReadNotificationDto {
  @ApiProperty()
  @IsInt()
  notificationId!: number;

  @ApiProperty()
  @IsInt()
  userId!: number;

  @ApiProperty()
  @IsBoolean()
  seen!: boolean;
}
