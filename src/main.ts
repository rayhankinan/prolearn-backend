import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import * as compression from 'compression';
import AppModule from './app.module';
const helmet = require('helmet');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  /* Global Middleware */
  app.use(helmet());
  app.use(compression());

  /* CORS */
  app.enableCors();

  /* Input Validation */
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

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
