import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { UserModule } from './domin/user/user.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { RemoveNullsInterceptor } from './common/interceptors/remove_nulls.interceptor';
import { TaskModule } from './domin/task/task.module';
import { UserAuthGuard } from './common/guards/user-auth.guard';
import { AuthModule } from './domin/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { NotificationModule } from './domin/notification/notification.module';
import { HealthcheckModule } from './healthcheck/healthcheck.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    TaskModule,
    NotificationModule,
    JwtModule.register({ secret: process.env.SECRET_KEY_JWT }),
    HealthcheckModule,
  ],
  providers: [
    ChatGateway,
    {
      provide: APP_GUARD,
      useClass: UserAuthGuard,
    },
    { provide: APP_INTERCEPTOR, useClass: RemoveNullsInterceptor },
  ],
})
export class AppModule {}
