import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async register(registerDto: RegisterDto) {
    // بررسی وجود کاربر با کد ملی
    const existingUser = await this.prisma.user.findUnique({
      where: { nationalCode: registerDto.nationalCode },
    });

    if (existingUser) {
      throw new ConflictException('کاربر با این کد ملی قبلاً ثبت نام کرده است');
    }

    // استفاده از سرویس کاربران برای ایجاد کاربر
    const user = await this.usersService.create(registerDto);

    // ایجاد توکن
    const payload = { 
      sub: user.id, 
      nationalCode: user.nationalCode, 
      role: user.role 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        nationalCode: user.nationalCode,
        firstName: user.firstName,
        lastName: user.lastName,
        fatherName: user.fatherName,
        role: user.role,
      },
    };
  }

  async login(loginDto: LoginDto) {
    // پیدا کردن کاربر با رمز عبور
    const user = await this.prisma.user.findUnique({
      where: { nationalCode: loginDto.nationalCode },
    });

    if (!user) {
      throw new UnauthorizedException('کد ملی یا رمز عبور اشتباه است');
    }

    // بررسی رمز عبور
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('کد ملی یا رمز عبور اشتباه است');
    }

    // ایجاد توکن
    const payload = { 
      sub: user.id, 
      nationalCode: user.nationalCode, 
      role: user.role 
    };

    // حذف password از اطلاعات کاربر
    const { password, ...userWithoutPassword } = user;

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        nationalCode: user.nationalCode,
        firstName: user.firstName,
        lastName: user.lastName,
        fatherName: user.fatherName,
        role: user.role,
      },
    };
  }

  async validateUser(payload: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        nationalCode: true,
        firstName: true,
        lastName: true,
        fatherName: true,
        profileImage: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}