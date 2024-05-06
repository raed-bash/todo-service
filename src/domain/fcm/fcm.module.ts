import { Module } from '@nestjs/common';
import { FCMEventService } from './service/fcm-event.service';

@Module({ providers: [FCMEventService] })
export class FCMModule {}
