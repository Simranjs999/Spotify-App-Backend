import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

dotenv.config(); // Loads environment variables from .env

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1'); // Prefix for all routes
  app.enableCors(); // Enable CORS for frontend
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true })); // Validates DTOs

  // Swagger API docs setup
  const config = new DocumentBuilder()
    .setTitle('Spotify Project API')
    .setDescription('API documentation for the Spotify Clone project')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port, 'localhost'); // Bind to IPv4 localhost
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();