import {
  ExecutionContext,
  ForbiddenException,
  createParamDecorator,
} from '@nestjs/common';
import { UserDto } from 'src/domain/user/dto/user.dto';

export const REQUEST_USER_INFO = Symbol('REQUEST_USER_INFO');

export type RequestUser = {
  user?: UserDto;
};

export const extractUserInfo = (ctx: ExecutionContext): RequestUser => {
  const request = ctx.switchToHttp().getRequest();

  const userInfo: RequestUser = request[REQUEST_USER_INFO];
  return userInfo;
};

export const ReqUser = createParamDecorator(
  (_, ctx: ExecutionContext): RequestUser['user'] => {
    const user = extractUserInfo(ctx);

    if (!user.user) throw new ForbiddenException('User is not registered');
    return user.user;
  },
);
