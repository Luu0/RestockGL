import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const userRole = await this.prisma.role.findUnique({
      where: { name: 'user' },
    });

    if (!userRole) {
      throw new Error('Role USER not found');
    }

    return this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        roleId: userRole.id,
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      include: { role: true },
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });
  }

  async update (id: number, data: UpdateUserDto) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }


    try {
      return await this.prisma.user.update({
        where: { id },
        data, 
      });
    } catch (error : any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      throw error;
    }
  }


  async remove(id: number) {
    const adminRole = await this.prisma.role.findUnique({
      where: { name: 'admin' },
    });

    if (!adminRole) {
      throw new Error('Admin role not found');
    }

    return this.prisma.user.delete({
      where: { id },
    });
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
  }

  async makeAdmin(userId: number) {
    const adminRole = await this.prisma.role.findUnique({
      where: { name: 'admin' },
    });

    if (!adminRole) {
      throw new Error('Admin role not found');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        roleId: adminRole.id,
      },
    });
  }
}