import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { OnEventTypes } from 'src/events/decorators/on-event.decorator';

@Injectable()
export class FCMEventService {
  private readonly FCM_SERVER: string = 'https://fcm.googleapis.com/fcm/send';

  constructor(private readonly httpService: HttpService) {}

  @OnEventTypes('fcm.send')
  async send(payload: FCMPayload) {
    try {
      const res = await this.httpService.axiosRef.post(
        this.FCM_SERVER,
        payload,
        {
          headers: {
            Authorization: `Bearer ${process.env.SERVER_FCM_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  }
}

export type FCMPayload = {
  registration_ids: string[];
  notification: {
    title: string;
    body: string;
  };
};
