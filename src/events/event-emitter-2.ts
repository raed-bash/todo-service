import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  AdaptedFCMEventServiceType,
  FCM_EVENT_TYPES,
} from 'src/domain/fcm/constants/fcm.events-type';

type EventTypes = FCM_EVENT_TYPES;

type ListenerParameters = AdaptedFCMEventServiceType;

export declare class EventEmitter2Types extends EventEmitter2 {
  emit<T extends EventTypes>(
    event: T,
    ...values: Parameters<ListenerParameters[T]>
  ): boolean;
}
