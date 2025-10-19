import { IsInt, IsString, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReportCardDto {
  @IsInt()
  @Type(() => Number)
  userId: number;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @Type(() => Number)
  uploadedBy: number;
}