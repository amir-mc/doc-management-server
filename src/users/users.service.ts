import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { role, ...userData } = createUserDto;
    
    return this.prisma.user.create({
      data: {
        ...userData,
        role: role || UserRole.USER,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id);
    
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async updateProfileImage(id: number, profileImage: string) {
    await this.findOne(id);
    
    return this.prisma.user.update({
      where: { id },
      data: { profileImage },
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
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}