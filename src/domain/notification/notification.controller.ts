import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { NotificationService } from './service/notification.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddNotificationTokenDto } from './dto/add-notification-token.dto';
import { ReqUser } from 'src/common/guards/user-auth.decorator';
import { UserDto } from '../user/dto/user.dto';
import { NotificationDto } from './dto/notification.dto';
import { QueryNotificationDto } from './dto/query-notification.dto';
import { PaginatedResultsDto } from 'src/common/dto/paginated-result.dto';
import { ReadNotificationDto } from './dto/read-notification.dto';
import { AuthRequired } from 'src/common/guards/auth-required.decorator';
import { SendNotificationDto } from './dto/send-notification.dto';
import { QueryUserDto } from '../user/dto/query-user.dto';
import { AllowRoles } from 'src/common/guards/user-auth.guard';

@Controller('notification')
@ApiTags('Notification')
@AuthRequired()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiOperation({ summary: 'Get to All notification of all the users' })
  @ApiResponse({ type: NotificationDto, isArray: true })
  @AllowRoles(['ADMIN'])
  async getAllNotifications(@Query() query: QueryNotificationDto) {
    const [count, notifications] =
      await this.notificationService.findAllByQuery(query);

    return new PaginatedResultsDto(notifications, count, query);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get to All notification of the user' })
  @ApiResponse({ type: NotificationDto, isArray: true })
  async getNotifications(
    @Query() query: QueryNotificationDto,
    @ReqUser() user: UserDto,
  ) {
    const [count, unseenTotal, notifications] =
      await this.notificationService.findByQuery({
        ...query,
        userId: user.id,
      });

    return {
      ...new PaginatedResultsDto(notifications, count, query),
      extra: { unseenTotal },
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get to Notification Info' })
  @ApiResponse({ type: NotificationDto })
  async getNotification(@Param('id', ParseIntPipe) id: number) {
    return await this.notificationService.findById(id);
  }

  @HttpCode(HttpStatus.OK)
  @Post('token')
  @ApiBody({ type: AddNotificationTokenDto })
  @ApiOperation({ summary: 'Get User of Notification token' })
  async addNotificationToken(
    @Body() body: AddNotificationTokenDto,
    @ReqUser() user: UserDto,
  ) {
    return await this.notificationService.addNotificationToken(body, user);
  }

  @Post('send')
  @ApiBody({ type: SendNotificationDto })
  @ApiOperation({ summary: 'Send Notification to Users' })
  @AllowRoles(['ADMIN'])
  async sendNotification(@Body() body: SendNotificationDto) {
    return await this.notificationService.sendNotification(body);
  }

  @Post('read')
  @ApiBody({ type: ReadNotificationDto })
  @ApiOperation({ summary: 'Change Notification Seen' })
  async changeNotificationSeen(@Body() body: ReadNotificationDto) {
    return await this.notificationService.readNotification(body);
  }
}
