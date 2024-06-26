import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/domain/user/service/user.service';
import { AddNotificationTokenDto } from '../dto/add-notification-token.dto';
import { UserDto } from 'src/domain/user/dto/user.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { NotificationDto } from '../dto/notification.dto';
import { QueryNotificationDto } from '../dto/query-notification.dto';
import { ReadNotificationDto } from '../dto/read-notification.dto';
import { SendNotificationDto } from '../dto/send-notification.dto';
import { QueryUserDto } from 'src/domain/user/dto/query-user.dto';
import { EventDispatcherService } from 'src/events/event-dispatcher.service';
import { Notification, UsersOnNotifications } from '@prisma/client';

@Injectable()
export class NotificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly emit: EventDispatcherService,
  ) {}

  async findAllByQuery(query: QueryNotificationDto) {
    const {
      userId,
      title,
      body,
      fromDate,
      toDate,
      orderBy,
      orderDir,
      page,
      perPage,
    } = query;

    return await this.prisma.$transaction([
      this.prisma.notification.count({
        where: {
          users: { every: { userId: userId } },
          title: { contains: title },
          body: { contains: body },
          createdAt: { gte: fromDate, lte: toDate },
        },
      }),
      this.prisma.notification.findMany({
        where: {
          users: { every: { userId: userId } },
          title: { contains: title },
          body: { contains: body },
          createdAt: { gte: fromDate, lte: toDate },
        },
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: orderBy ? { [orderBy]: orderDir } : undefined,
      }),
    ]);
  }

  async addNotificationToken(data: AddNotificationTokenDto, user: UserDto) {
    const notificationUser = await this.prisma.user.update({
      where: { id: user.id },
      data: { firebaseToken: data.notificationToken },
      select: { firebaseToken: true },
    });

    return notificationUser;
  }

  async findById(id: number) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException(`Notifiation Not Found With id: ${id}`);
    }

    return notification;
  }

  async storeNotification(
    userIds: number[],
    data: Omit<NotificationDto, 'id' | 'seen'>,
  ) {
    return await this.prisma.$transaction(async () => {
      const notification = await this.prisma.notification.create({
        data,
      });

      for (const userId of userIds) {
        await this.prisma.usersOnNotifications.create({
          data: { notificationId: notification.id, userId: userId },
        });
      }

      return notification;
    });
  }

  async findByQuery(query: QueryNotificationDto & { userId: number }): Promise<
    [
      number,
      number,
      {
        seen: UsersOnNotifications['seen'];
        notification: Notification;
      }[],
    ]
  > {
    const { userId, orderBy, orderDir, page, perPage } = query;

    const [count, unseenTotal, notifications] = await this.prisma.$transaction([
      this.prisma.usersOnNotifications.count({
        where: { userId },
      }),
      this.prisma.usersOnNotifications.count({
        where: { userId, seen: false },
      }),
      this.prisma.usersOnNotifications.findMany({
        where: { userId },
        select: { seen: true, notification: true, userId: true },
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: {
          notification: orderBy ? { [orderBy]: orderDir } : undefined,
        },
      }),
    ]);

    return [count, unseenTotal, notifications];
  }

  async readNotification(data: ReadNotificationDto) {
    const usersOnNotification =
      await this.prisma.usersOnNotifications.findUnique({
        where: {
          notificationId_userId: {
            notificationId: data.notificationId,
            userId: data.userId,
          },
        },
      });

    if (!usersOnNotification) {
      throw new NotFoundException();
    }

    return await this.prisma.usersOnNotifications.update({
      where: {
        notificationId_userId: {
          notificationId: data.notificationId,
          userId: data.userId,
        },
      },
      data: { seen: data.seen },
    });
  }

  async sendNotification(data: SendNotificationDto) {
    const firebaseTokens: string[] = [];

    if (data.userIds.length) {
      for (const id of data.userIds) {
        const users = await this.userService.findById(id, { role: data.role });
        if (users.firebaseToken) {
          firebaseTokens.push(users.firebaseToken);
        }
      }
    } else {
      const role = data.role;
      const limit = 30;
      let skip = 0;
      const total = await this.prisma.user.count({
        where: { locked: false, role: role },
      });

      while (true) {
        const users = await this.retriveAllUser(
          { locked: false, role: role },
          { limit, skip },
        );

        users.forEach(({ id, firebaseToken }) => {
          data.userIds.push(id);
          if (firebaseToken) {
            firebaseTokens.push(firebaseToken);
          }
        });

        skip += limit;

        if (skip >= total) break;
      }
    }

    this.emit.sendFCM({
      notification: { title: data.title, body: data.body },
      registration_ids: firebaseTokens,
    });

    return await this.storeNotification(data.userIds, {
      body: data.body,
      title: data.title,
    });
  }

  async retriveAllUser(
    filter: Pick<SendNotificationDto & QueryUserDto, 'role' | 'locked'>,
    { skip, limit }: { skip: number; limit: number },
  ) {
    return await this.prisma.user.findMany({
      where: { ...filter },
      skip: skip,
      take: limit,
      select: { id: true, firebaseToken: true },
    });
  }
}
