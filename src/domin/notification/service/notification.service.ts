import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/domin/user/service/user.service';
import { AddNotificationDto } from '../dto/add-notification.dto';
import { UserDto } from 'src/domin/user/dto/user.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { NotificationDto } from '../dto/notification.dto';
import { NotificationQueryDto } from '../dto/notification-query.dto';

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
    data: Omit<NotificationDto, 'id'>,
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

  async findByQuery(query: NotificationQueryDto & { userId: number }) {
    const { userId, orderBy, orderDir } = query;

    return await this.prisma.$transaction([
      this.prisma.notification.count({
        where: {
          users: { some: { userId: userId } },
        },
      }),
      this.prisma.notification.findMany({
        where: {
          users: { some: { userId: userId } },
        },
        orderBy: orderBy ? { [orderBy]: orderDir } : undefined,
      }),
    ]);
  }
}
