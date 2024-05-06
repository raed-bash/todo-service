import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FCMPayload } from 'src/domain/fcm/service/fcm-event.service';
import { Events } from './events';

@Injectable()
export class EventDispatcherService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  sendFCM(payload: FCMPayload) {
    this.eventEmitter.emit('fcm.send' as Events, payload);
  }
}
