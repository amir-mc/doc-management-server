import { UserRole } from '@prisma/client';
import { IsEnum, IsOptional, IsString, MinLength, Matches } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(10, { message: 'کد ملی باید ۱۰ رقمی باشد' })
  @Matches(/^\d+$/, { message: 'کد ملی باید فقط شامل اعداد باشد' })
  nationalCode: string;

  @IsString()
  @MinLength(2, { message: 'نام باید حداقل ۲ کاراکتر باشد' })
  firstName: string;

  @IsString()
  @MinLength(2, { message: 'نام خانوادگی باید حداقل ۲ کاراکتر باشد' })
  lastName: string;

  @IsString()
  @MinLength(2, { message: 'نام پدر باید حداقل ۲ کاراکتر باشد' })
  fatherName: string;

  @IsString()
  @MinLength(6, { message: 'رمز عبور باید حداقل ۶ کاراکتر باشد' })
  password: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}