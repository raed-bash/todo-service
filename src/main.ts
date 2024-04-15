import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swagger } from './swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  swagger(app);
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  const config = app.get(ConfigService);
  const PORT = config.get('PORT') ?? 3001;

  await app.listen(PORT);
}
bootstrap();
