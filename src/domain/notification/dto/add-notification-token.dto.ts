import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddNotificationTokenDto {
  @ApiProperty()
  @IsString()
  notificationToken!: string;
}
