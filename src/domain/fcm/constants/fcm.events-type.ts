import { FCMEventService } from '../service/fcm-event.service';

export type FCMPayload = {
  registration_ids: string[];
  notification: {
    title: string;
    body: string;
  };
};
export type FCM_EVENT_TYPES = `fcm.${keyof FCMEventService}`;

export type AdaptedFCMEventServiceType = Record<
  FCM_EVENT_TYPES,
  FCMEventService[keyof FCMEventService]
>;
