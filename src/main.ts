import * as dotenv from 'dotenv';
import { existsSync } from 'fs';
import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const envPath = join(process.cwd(), '.env');
  if (existsSync(envPath)) {
    dotenv.config({ path: envPath });
  } else if (process.env.NODE_ENV !== 'production') {
    const envExamplePath = join(process.cwd(), '.env.example');
    if (existsSync(envExamplePath)) dotenv.config({ path: envExamplePath });
  }

  const app = await NestFactory.create(AppModule);

  // Increase payload limit for base64 images
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));

  app.enableCors({
    origin: true, // Allow all origins temporarily for troubleshooting
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type,Accept,Authorization,X-Requested-With',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Backend running on port ${port}`);
  // Triggering restart to pick up new routes
}

bootstrap();
