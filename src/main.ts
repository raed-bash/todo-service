import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swagger } from './swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  swagger(app);
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  await app.listen(3001);
}
bootstrap();
