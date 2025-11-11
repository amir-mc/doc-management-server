import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Reflector } from '@nestjs/core';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // فعال‌سازی ValidationPipe
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    // سرویس فایل‌های استاتیک - مسیر کامل و صحیح
 const uploadsPath = join(process.cwd(), 'uploads');
  console.log('📁 Static files path:', uploadsPath);
  console.log('📁 Current working directory:', process.cwd());
  
  // بررسی وجود پوشه uploads
  const fs = require('fs');
  if (!fs.existsSync(uploadsPath)) {
    console.error('❌ Uploads directory does not exist!');
  } else {
   
    
    // لیست پوشه‌های داخل uploads
    const items = fs.readdirSync(uploadsPath);
    
    
    // بررسی پوشه report-cards
    const reportCardsPath = join(uploadsPath, 'report-cards');
    if (fs.existsSync(reportCardsPath)) {
      const reportCardsFiles = fs.readdirSync(reportCardsPath);
      console.log('📁 Files in report-cards:', reportCardsFiles);
    }
  }
  
  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads/',
  });
  // فعال‌سازی JwtAuthGuard برای کل برنامه
  // const reflector = app.get(Reflector);
  // app.useGlobalGuards(new JwtAuthGuard(reflector));

  // فعال‌سازی CORS و فایل‌های استاتیک...
 app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://185.24.253.55:3000'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
    exposedHeaders: ['Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
  });
  await app.listen(3001);
  console.log(`✅ Server running on http://localhost:3001`);
}
bootstrap();
