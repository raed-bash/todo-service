import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { EditTaskDto } from '../dto/edit-task.dto';
import { ChangeCompletedStatusTaskDto } from '../dto/change-completed-status-task.dto';
import { Roles } from '@prisma/client';
import { AllQueryTaskDto } from '../dto/all-query-task.dto';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}
  async findByQuery(query: AllQueryTaskDto & { role?: Roles }) {
    const {
      title,
      completed,
      page,
      perPage,
      userId,
      fromDate,
      toDate,
      role,
      orderBy,
      orderDir,
    } = query;

    return await this.prisma.$transaction([
      this.prisma.task.count({
        where: {
          completed,
          title: { contains: title },
          userId,
          createdAt: { gte: fromDate, lte: toDate },
          removedAt: null,
          user: { role },
        },
      }),
      this.prisma.task.findMany({
        where: {
          completed,
          title: { contains: title },
          userId,
          createdAt: { gte: fromDate, lte: toDate },
          removedAt: null,
          user: { role },
        },
        take: perPage,
        skip: (page - 1) * perPage,
        orderBy: orderBy ? { [orderBy]: orderDir } : undefined,
      }),
    ]);
  }

  async findByQueryDeleted(query: AllQueryTaskDto & { role?: Roles }) {
    const {
      title,
      completed,
      page,
      perPage,
      userId,
      fromDate,
      toDate,
      role,
      orderBy,
      orderDir,
    } = query;

    return await this.prisma.$transaction([
      this.prisma.task.count({
        where: {
          completed,
          title: { contains: title },
          userId,
          createdAt: { gte: fromDate, lte: toDate },
          NOT: { removedAt: null },
          user: { role: role },
        },
      }),
      this.prisma.task.findMany({
        where: {
          completed,
          title: { contains: title },
          userId,
          createdAt: { gte: fromDate, lte: toDate },
          NOT: { removedAt: null },
          user: { role: role },
        },
        take: perPage,
        skip: (page - 1) * perPage,
        orderBy: orderBy ? { [orderBy]: orderDir } : undefined,
      }),
    ]);
  }

  async create(data: CreateTaskDto & { userId: number }) {
    return await this.prisma.task.create({
      data: { ...data },
    });
  }

  async edit(data: EditTaskDto & { userId: number }) {
    const task = await this.findById(data.id);

    return await this.prisma.task.update({
      where: { id: task.id },
      data: { ...data, updatedAt: new Date() },
    });
  }

  async findById(id: number, userId?: number) {
    const task = await this.prisma.task.findUnique({
      where: { id, userId },
    });
    if (!task) {
      throw new NotFoundException(`Task is Not Exist`);
    }
    return task;
  }

  async changeCompletedStatus(
    data: ChangeCompletedStatusTaskDto,
    userId: number,
  ) {
    await this.findById(data.id, userId);

    return this.prisma.task.update({
      where: { id: data.id },
      data: { completed: data.completed },
    });
  }

  async delete(id: number, userId: number) {
    const task = await this.findById(id, userId);

    if (task?.removedAt !== null) {
      throw new BadRequestException('Task is Already Removed');
    }

    return this.prisma.task.update({
      where: { id },
      data: { removedAt: new Date() },
    });
  }
}
