import { Module } from '@nestjs/common';
import { EventDispatcherService } from './event-dispatcher.service';

@Module({
  providers: [EventDispatcherService],
  exports: [EventDispatcherService],
})
export class EventDispatcherModule {}
