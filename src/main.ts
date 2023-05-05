import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as compression from 'compression';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.use(compression());
  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: false }));

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
