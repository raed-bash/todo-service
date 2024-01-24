import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './service/task.service';
import { UserService } from '../user/service/user.service';
import { AllTaskService } from './service/all-task.service';

@Module({
  controllers: [TaskController],
  providers: [TaskService, UserService, AllTaskService],
})
export class TaskModule {}
