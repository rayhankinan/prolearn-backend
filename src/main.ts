import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import compression from 'compression';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
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
    .setVersion('v1')
    .addTag('ProLearn')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  await app.listen(8080);
}

bootstrap();
