import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { FCMPayload } from '../constants/fcm.events-type';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class FCMEventService {
  private readonly FCM_SERVER: string = 'https://fcm.googleapis.com/fcm/send';

  constructor(private readonly httpService: HttpService) {}

  @OnEvent('fcm.send')
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
