import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
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
import { NotificationQueryDto } from './dto/notification-query.dto';
import { PaginatedQueryDto } from 'src/common/dto/paginated-query.dto';
import { PaginatedResultsDto } from 'src/common/dto/paginated-result.dto';

@Controller('notification')
@ApiTags('Notification')
@ApiBearerAuth()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiOperation({ summary: 'Get to All notification of the user' })
  @ApiResponse({ type: NotificationDto })
  async getNotifications(
    @Query() query: NotificationQueryDto,
    @ReqUser() user: UserDto,
  ) {
    const [count, notifications] = await this.notificationService.findByQuery({
      ...query,
      userId: user.id,
    });

    return new PaginatedResultsDto(notifications, count, query);
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
