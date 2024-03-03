import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { QueryUserDto } from '../dto/query-user.dto';
import { EditUserDto } from '../dto/edit-user.dto';
import * as bycrpt from 'bcrypt';
import { ChangePasswordUserDto } from '../dto/change-password-user.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findByQuery(query: QueryUserDto) {
    const { username, locked, role, perPage, page } = query;

    return this.prisma.$transaction([
      this.prisma.user.count({
        where: {
          username: { contains: username },
          locked: { equals: locked },
          role: { equals: role },
        },
      }),
      this.prisma.user.findMany({
        where: {
          username: { contains: username },
          locked: { equals: locked },
          role: { equals: role },
        },
        take: perPage,
        skip: (page - 1) * perPage,
        select: this.USER_SELECT,
      }),
    ]);
  }

  async create(data: CreateUserDto) {
    return this.prisma.$transaction(async (prisma) => {
      const existing = await prisma.user.findUnique({
        where: { username: data.username },
        select: this.USER_SELECT,
      });

      if (existing) {
        throw new BadRequestException('is Already Exist');
      }
      const randomSalt = Math.random() * 10;

      const hashPassword = await bycrpt.hash(data.password, randomSalt);

      const user = await prisma.user.create({
        data: { ...data, password: hashPassword },
        select: this.USER_SELECT,
      });

      return user;
    });
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: this.USER_SELECT,
    });
    if (!user) throw new NotFoundException(`user Not Found With id ${id}`);
    return user;
  }

  async edit(data: EditUserDto) {
    return this.prisma.$transaction(async (prisma) => {
      await this.findById(data.id);

      if (data.username) {
        const usernameUsed = await prisma.user.findUnique({
          where: { username: data.username, NOT: { id: data.id } },
        });

        if (usernameUsed) {
          throw new BadRequestException('username is used');
        }
      }

      const user = await prisma.user.update({
        data: {
          locked: data.locked,
          username: data.username,
          role: data.role,
          updatedAt: new Date(),
        },
        where: { id: data.id },
        select: this.USER_SELECT,
      });

      return user;
    });
  }

  async changePassword(data: ChangePasswordUserDto) {
    await this.findById(data.id);

    const randomSalt = Math.random() * 10;

    const hashPassword = await bycrpt.hash(data.password, randomSalt);

    return await this.prisma.user.update({
      data: { password: hashPassword },
      where: { id: data.id },
      select: this.USER_SELECT,
    });
  }

  async findEmployeeUser(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: id, role: 'EMPLOYEE' },
      select: { ...this.USER_SELECT, firebaseToken: true },
    });

    if (!user) throw new NotFoundException(`user Not Found With id ${id}`);
    return user;
  }
  USER_SELECT = {
    id: true,
    username: true,
    locked: true,
    role: true,
    createdAt: true,
    updatedAt: true,
  } as const satisfies Prisma.UserSelect;
}
