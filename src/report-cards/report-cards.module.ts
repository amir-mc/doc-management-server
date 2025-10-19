import { Module } from '@nestjs/common';
import { ReportCardsService } from './report-cards.service';
import { ReportCardsController } from './report-cards.controller';

@Module({
  controllers: [ReportCardsController],
  providers: [ReportCardsService],
  exports: [ReportCardsService],
})
export class ReportCardsModule {}