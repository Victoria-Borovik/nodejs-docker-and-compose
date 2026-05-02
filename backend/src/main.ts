import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors();
  app.enableCors({
    origin: 'http://localhost:3000',
    allowedHeaders: 'Access-Control-Allow-Origin',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(configService.get('port'));
}
bootstrap();
