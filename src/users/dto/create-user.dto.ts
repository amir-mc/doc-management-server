import { UserRole } from '@prisma/client';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  nationalCode: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  fatherName: string;

  @IsString()
  @MinLength(6, { message: 'رمز عبور باید حداقل ۶ کاراکتر باشد' })
  password: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}