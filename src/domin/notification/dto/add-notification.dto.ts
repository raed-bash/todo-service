import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddNotificationDto {
  @ApiProperty()
  @IsString()
  notificationToken!: string;
}
