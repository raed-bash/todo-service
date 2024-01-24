import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'dgram';

const messageInterval: NodeJS.Timeout[] = [];

@WebSocketGateway(3002)
export class ChatGateway {
  @WebSocketServer()
  server: Socket;

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string): void {
    messageInterval.push(
      setInterval(() => {
        this.server.emit('message', `hello ${message}`);
      }, 1000),
    );
  }

  @SubscribeMessage('stop')
  handleStop() {
    messageInterval.forEach((messageInterval) => {
      clearInterval(messageInterval);
    });
  }
}
