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
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const allowedOrigins = [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        process.env.ADMIN_DASHBOARD_URL,
      ].filter(Boolean);
      
      if (allowedOrigins.some(o => origin.startsWith(o))) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'), false);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Backend running on port ${port}`);
  // Triggering restart to pick up new routes
}

bootstrap();
