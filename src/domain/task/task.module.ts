import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './service/task.service';
import { UserService } from '../user/service/user.service';
import { AllTaskService } from './service/all-task.service';
import { NotificationService } from '../notification/service/notification.service';
import { EventDispatcherModule } from 'src/events/event-dispatcher.module';

@Module({
  imports: [EventDispatcherModule],
  controllers: [TaskController],
  providers: [TaskService, UserService, AllTaskService, NotificationService],
})
export class TaskModule {}
