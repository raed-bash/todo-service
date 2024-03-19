import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/domin/user/service/user.service';
import { AddNotificationDto } from '../dto/add-notification.dto';
import { UserDto } from 'src/domin/user/dto/user.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { NotificationDto } from '../dto/notification.dto';
import { NotificationQueryDto } from '../dto/notification-query.dto';
import { ReadNotificationDto } from '../dto/read-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async addNotificationToken(data: AddNotificationDto, user: UserDto) {
    const notificationUser = await this.prisma.user.update({
      where: { id: user.id },
      data: { firebaseToken: data.notificationToken },
      select: { firebaseToken: true },
    });

    return notificationUser;
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

  async findByQuery(query: NotificationQueryDto & { userId: number }): Promise<
    [
      number,
      number,
      {
        seen: boolean;
        notification: {
          id: number;
          title: string;
          body: string;
          createdAt: Date;
        };
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
}
