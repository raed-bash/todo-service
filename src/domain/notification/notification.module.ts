import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './service/notification.service';
import { UserService } from '../user/service/user.service';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService, UserService],
})
export class NotificationModule {}
