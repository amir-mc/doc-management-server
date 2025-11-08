import { AppService } from './app.service';

import { Controller, Get, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

   
@Get('uploads/:folder/:filename')
  async serveFile(
    @Param('folder') folder: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    try {
      // استفاده از process.cwd() برای مسیر اصلی پروژه
      const filePath = join(process.cwd(), 'uploads', folder, filename);
      console.log('📁 Serving file from:', filePath);
      console.log('📁 Current working directory:', process.cwd());
      
      if (!existsSync(filePath)) {
        console.error('❌ File not found:', filePath);
        
        // لیست فایل‌های موجود در پوشه
        const uploadsPath = join(process.cwd(), 'uploads', folder);
        try {
          const fs = require('fs');
          const files = fs.readdirSync(uploadsPath);
          console.log('📁 Available files in folder:', files);
        } catch (e) {
          console.error('❌ Cannot read uploads directory:', e.message);
        }
        
        return res.status(404).json({
          message: 'File not found',
          path: filePath,
          cwd: process.cwd(),
        });
      }
      
      console.log('✅ File found, sending...');
      return res.sendFile(filePath);
    } catch (error) {
      console.error('❌ Error serving file:', error);
      return res.status(500).json({
        message: 'Error serving file',
        error: error.message,
      });
    }
  }
}
