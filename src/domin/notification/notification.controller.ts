import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
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
import { NotificationDto } from './dto/notification.dto';

@Controller('notification')
@ApiTags('Notification')
@ApiBearerAuth()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiOperation({ summary: 'Get to All notification of the user' })
  @ApiResponse({ type: NotificationDto })
  async getNotifications(@ReqUser() user: UserDto) {
    return await this.notificationService.findNotification(user.id);
  }

  @HttpCode(HttpStatus.OK)
  @Post()
  @ApiBody({ type: AddNotificationDto })
  @ApiOperation({ summary: 'Get User of Notification token' })
  addNotificationToken(
    @Body() body: AddNotificationDto,
    @ReqUser() user: UserDto,
  ) {
    return this.notificationService.addNotificationToken(body, user);
  }
}
