import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @MinLength(10, { message: 'کد ملی باید ۱۰ رقمی باشد' })
  nationalCode: string;

  @IsString()
  @MinLength(6, { message: 'رمز عبور باید حداقل ۶ کاراکتر باشد' })
  password: string;
}