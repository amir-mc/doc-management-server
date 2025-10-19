import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportCardDto } from './dto/create-report-card.dto';
import { UpdateReportCardDto } from './dto/update-report-card.dto';

@Injectable()
export class ReportCardsService {
  constructor(private prisma: PrismaService) {}

  async create(createReportCardDto: CreateReportCardDto, filePath: string) {
    // بررسی وجود کاربر (حالا userId قطعاً number است)
    const user = await this.prisma.user.findUnique({
      where: { id: createReportCardDto.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.reportCard.create({
      data: {
        ...createReportCardDto,
        filePath,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            nationalCode: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.reportCard.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            nationalCode: true,
          },
        },
      },
      orderBy: {
        uploadedAt: 'desc',
      },
    });
  }

  async findByUserId(userId: number) {
    return this.prisma.reportCard.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            nationalCode: true,
          },
        },
      },
      orderBy: {
        uploadedAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const reportCard = await this.prisma.reportCard.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            nationalCode: true,
          },
        },
      },
    });

    if (!reportCard) {
      throw new NotFoundException('Report card not found');
    }

    return reportCard;
  }

  async update(id: number, updateReportCardDto: UpdateReportCardDto) {
    await this.findOne(id); // بررسی وجود کارنامه

    return this.prisma.reportCard.update({
      where: { id },
      data: updateReportCardDto,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            nationalCode: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.reportCard.delete({
      where: { id },
    });
  }
}