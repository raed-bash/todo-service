import { Module } from '@nestjs/common';
import { FCMEventService } from './service/fcm-event.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [FCMEventService],
  imports: [HttpModule.register({ timeout: 5000, maxRedirects: 5 })],
})
export class FCMModule {}
