import { ApiProperty } from '@nestjs/swagger';

export class NotificationDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  body!: string;
}
