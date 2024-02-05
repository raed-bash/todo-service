import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/domin/user/service/user.service';
import { AddNotificationDto } from '../dto/add-notification.dto';
import { UserDto } from 'src/domin/user/dto/user.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { NotificationDto } from '../dto/notification.dto';

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
    });
    return { message: 'ok' };
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

  async findNotification(userId: number) {
    const notifications = await this.prisma.notification.findMany({
      where: {
        users: { some: { userId: userId } },
      },
    });

    if (!notifications) {
      throw new NotFoundException();
    }

    return notifications;
  }
}
