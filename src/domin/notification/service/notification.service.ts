import { Injectable } from '@nestjs/common';
import { UserService } from 'src/domin/user/service/user.service';
import { AddNotificationDto } from '../dto/add-notification.dto';
import { UserDto } from 'src/domin/user/dto/user.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';

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
}
