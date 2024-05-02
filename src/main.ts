import * as fs from 'fs';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  let app;
  if (process.env.NODE_ENV === 'production') {
    app = await NestFactory.create(AppModule, {
      httpsOptions: {
        key: fs.readFileSync(
          `${process.env.SSL_BASE_PATH}/privkey.pem`,
          'utf8',
        ),
        cert: fs.readFileSync(`${process.env.SSL_BASE_PATH}/cert.pem`, 'utf8'),
        ca: fs.readFileSync(`${process.env.SSL_BASE_PATH}/chain.pem`, 'utf8'),
      },
    });
  } else {
    app = await NestFactory.create(AppModule);
  }

  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
      transform: true,
    }),
  );

  const options = new DocumentBuilder()
    .setTitle('API João Bicudo')
    .setDescription('API João Bicudo - Developed by Crosoften Enginnering Team')
    .setVersion('2.0')
    .addBearerAuth()
    .addServer('/')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  app.enableCors({
    origin: '*',
  });

  await app.listen(process.env.API_PORT || 3000);
}
bootstrap();
