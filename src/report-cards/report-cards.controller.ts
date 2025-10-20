import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseInterceptors, 
  UploadedFile,
  ParseIntPipe,
  BadRequestException, 
  Logger,
  UseGuards
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ReportCardsService } from './report-cards.service';
import { CreateReportCardDto } from './dto/create-report-card.dto';
import { UpdateReportCardDto } from './dto/update-report-card.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('report-cards')
@UseGuards(JwtAuthGuard)
export class ReportCardsController {
  private readonly logger = new Logger(ReportCardsController.name);

  constructor(private readonly reportCardsService: ReportCardsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/report-cards',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = extname(file.originalname);
        callback(null, `report-${uniqueSuffix}${ext}`);
      },
    }),
    fileFilter: (req, file, callback) => {
      const allowedMimes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedMimes.includes(file.mimetype)) {
        return callback(new BadRequestException('فقط فایل‌های PDF و تصویر مجاز هستند'), false);
      }
      callback(null, true);
    },
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
  }))
  async create(
    @Body() createReportCardDto: CreateReportCardDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    this.logger.log('Received file upload request');
    this.logger.log('File info:', {
      originalname: file?.originalname,
      mimetype: file?.mimetype,
      size: file?.size,
    });
    this.logger.log('Report card data:', createReportCardDto);

    if (!file) {
      throw new BadRequestException('هیچ فایلی آپلود نشده است');
    }

    const filePath = `uploads/report-cards/${file.filename}`;

    return this.reportCardsService.create(createReportCardDto, filePath);
  }


  @Get()
   @Roles(UserRole.ADMIN)
  findAll() {
    return this.reportCardsService.findAll();
  }

  @Get('user/:userId')
  findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.reportCardsService.findByUserId(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reportCardsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReportCardDto: UpdateReportCardDto,
  ) {
    return this.reportCardsService.update(id, updateReportCardDto);
  }

  @Delete(':id')
    @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reportCardsService.remove(id);
  }
}