import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { REQUEST_USER_INFO, RequestUser } from './user-auth.decorator';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { Roles } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { isAuthRequired } from './auth-required.decorator';

export const AllowRoles = Reflector.createDecorator<Roles[]>();

@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (!isAuthRequired(this.reflector, context)) return true;
    const request: Request = context.switchToHttp().getRequest();

    const authHeader = request.headers['authorization'];

    this._checkAuthToken(authHeader);

    const jwtToken = authHeader.slice('Bearer '.length);

    await this._verfiyJwt(jwtToken);

    const userAuth = this._decodeJwtToken(jwtToken);

    const allowRoles =
      this.reflector.get(AllowRoles, context.getHandler()) ?? [];

    const userId = userAuth.userId;

    if (!Number.isInteger(userId))
      throw new ForbiddenException('No userId could be retreived from headers');

    const user = await this._getUser(userId);
    if (user.locked) {
      throw new UnauthorizedException('You Are Banned');
    }

    const userInfo: RequestUser = {
      user,
    };

    request[REQUEST_USER_INFO] = userInfo;

    const userRole = user.role;

    if (
      user &&
      (allowRoles.length === 0 || allowRoles.some((r) => r === userRole))
    )
      return true;

    throw new ForbiddenException(
      'You are not authorized to perform this operation',
    );
  }

  private _decodeJwtToken(jwtToken: string) {
    const jwtPayload = jwtToken.split('.')[1];

    try {
      return JSON.parse(Buffer.from(jwtPayload, 'base64').toString('utf8'));
    } catch (err) {
      throw new ForbiddenException('Cannot decode Authorization token');
    }
  }

  private _checkAuthToken(authHeader: string) {
    if (!authHeader || typeof authHeader !== 'string')
      throw new ForbiddenException('No Authorization token provided');

    if (
      !authHeader.startsWith('Bearer ') ||
      (authHeader.match(/\./g) || []).length !== 2
    )
      throw new ForbiddenException('Cannot decode Authorization token');
  }

  private async _verfiyJwt(jwtToken: string) {
    try {
      await this.jwtService.verifyAsync(jwtToken);
    } catch {
      throw new UnauthorizedException();
    }
  }

  private async _getUser(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user;
  }
}
