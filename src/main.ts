import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // فعال‌سازی ValidationPipe
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // فعال‌سازی JwtAuthGuard برای کل برنامه
  // const reflector = app.get(Reflector);
  // app.useGlobalGuards(new JwtAuthGuard(reflector));

  // فعال‌سازی CORS و فایل‌های استاتیک...
  app.enableCors({ origin: ['http://localhost:3000'], credentials: true });

  await app.listen(3001);
  console.log(`✅ Server running on http://localhost:3001`);
}
bootstrap();
