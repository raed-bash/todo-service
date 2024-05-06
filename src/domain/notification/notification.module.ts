import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './service/notification.service';
import { UserService } from '../user/service/user.service';
import { EventDispatcherModule } from 'src/events/event-dispatcher.module';

@Module({
  imports: [EventDispatcherModule],
  controllers: [NotificationController],
  providers: [NotificationService, UserService],
})
export class NotificationModule {}
