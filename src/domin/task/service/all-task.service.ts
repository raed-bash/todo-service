import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { AllCreateTaskDto } from '../dto/all-create-task.dto';
import { UserService } from 'src/domin/user/service/user.service';
import { EditTaskDto } from '../dto/edit-task.dto';
import { ChangeCompletedStatusTaskDto } from '../dto/change-completed-status-task.dto';
import { TaskDto } from '../dto/task.dto';
import { Task, User } from '@prisma/client';

@Injectable()
export class AllTaskService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async editToUser(data: EditTaskDto) {
    await this.findById(data.id);

    return this.prisma.task.update({
      data: {
        title: data.title,
        completed: data.completed,
        updatedAt: new Date(),
      },
      include: { user: true },
      where: { id: data.id },
    });
  }

  async createToUser(data: AllCreateTaskDto): Promise<[Task, string]> {
    const user = await this.userService.findEmployeeUser(data.userId);

    const task = await this.prisma.task.create({
      data,
      include: { user: { select: this.userService.USER_SELECT } },
    });

    return [task, user.firebaseToken];
  }

  async findById(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id, user: { role: 'EMPLOYEE' } },
      include: { user: true },
    });
    if (!task) {
      throw new NotFoundException(`Task is Not Exist`);
    }
    return task;
  }

  async changeCompletedStatusToUser(data: ChangeCompletedStatusTaskDto) {
    await this.findById(data.id);

    return this.prisma.task.update({
      where: { id: data.id },
      data: { completed: data.completed },
      include: { user: true },
    });
  }

  async deleteToUser(id: number) {
    await this.findById(id);

    return this.prisma.task.update({
      where: { id },
      data: { removedAt: new Date() },
      include: { user: true },
    });
  }
}
