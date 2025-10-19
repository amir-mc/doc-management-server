import { UserRole } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  nationalCode: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  fatherName: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}