import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { ReportCardsModule } from './report-cards/report-cards.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [PrismaModule, UsersModule, ReportCardsModule, AuthModule,ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}