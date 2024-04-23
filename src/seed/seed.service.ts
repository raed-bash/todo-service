import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UserService } from 'src/domain/user/service/user.service';

@Injectable()
export class SeedService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}
  async putSeed() {
    const count = await this.prisma.user.count();
    if (count) {
      throw new BadRequestException('already putted seed');
    }
    await this.userService.create({
      username: process.env.DEFAULT_USERNAME,
      password: process.env.DEFAULT_PASSWORD,
      role: 'ADMIN',
    });
  }
}
