import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  
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