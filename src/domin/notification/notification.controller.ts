import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { NotificationService } from './service/notification.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AddNotificationDto } from './dto/add-notification.dto';
import { ReqUser } from 'src/common/guards/user-auth.decorator';
import { UserDto } from '../user/dto/user.dto';
class AddNotificationResDto {
  @ApiProperty()
  message!: string;
}

@Controller('notification')
@ApiTags('Notification')
@ApiBearerAuth()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}
  @HttpCode(HttpStatus.OK)
  @Post()
  @ApiBody({ type: AddNotificationDto })
  @ApiOperation({ summary: 'Get User of Notification token' })
  @ApiResponse({ type: AddNotificationResDto })
  addNotificationToken(
    @Body() body: AddNotificationDto,
    @ReqUser() user: UserDto,
  ) {
    return this.notificationService.addNotificationToken(body, user);
  }
}
