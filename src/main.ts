import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import * as compression from 'compression';

import CloudLogger from '@logger/models/cloud-logger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  /* Input Validation */
  app.useGlobalPipes(new ValidationPipe());

  /* Global Middleware */
  app.use(compression());

  /* API Versioning */
  app.enableVersioning({
    type: VersioningType.URI,
  });

  /* Setup OpenAPI */
  const options = new DocumentBuilder()
    .setTitle('ProLearn API')
    .setDescription('The ProLearn API description')
    .addTag('ProLearn')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  await app.listen(8080);
}

bootstrap();
