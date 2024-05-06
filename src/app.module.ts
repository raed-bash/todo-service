import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { UserModule } from './domain/user/user.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { RemoveNullsInterceptor } from './common/interceptors/remove_nulls.interceptor';
import { TaskModule } from './domain/task/task.module';
import { UserAuthGuard } from './common/guards/user-auth.guard';
import { AuthModule } from './domain/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { NotificationModule } from './domain/notification/notification.module';
import { HealthcheckModule } from './healthcheck/healthcheck.module';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { FCMModule } from './domain/fcm/fcm.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    HttpModule.register({ timeout: 5000, maxRedirects: 5 }),
    JwtModule.register({ secret: process.env.SECRET_KEY_JWT }),
    PrismaModule,
    AuthModule,
    UserModule,
    TaskModule,
    NotificationModule,
    HealthcheckModule,
    FCMModule,
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
