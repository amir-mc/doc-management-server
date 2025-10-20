import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { role, password, ...userData } = createUserDto;
    
    // هش کردن رمز عبور
    const hashedPassword = await bcrypt.hash(password, 10);
    
    return this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        role: role || UserRole.USER,
      },
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
  }

  async findAll() {
    return this.prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
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
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
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
      throw new NotFoundException('User not found');
    }
    
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id);
    
    // اگر رمز عبور آپدیت شده، آن را هش کن
    let updateData = { ...updateUserDto };
    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    
    return this.prisma.user.update({
      where: { id },
      data: updateData,
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
  }

  async updateProfileImage(id: number, profileImage: string) {
    await this.findOne(id);
    
    return this.prisma.user.update({
      where: { id },
      data: { profileImage },
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
  }

  async remove(id: number) {
    await this.findOne(id);
    
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async findUserWithReportCards(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        reportCards: {
          orderBy: {
            uploadedAt: 'desc',
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
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // حذف password از خروجی
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // متد برای پیدا کردن کاربر با رمز عبور (برای احراز هویت)
  async findUserForAuth(nationalCode: string) {
    return this.prisma.user.findUnique({
      where: { nationalCode },
    });
  }
}