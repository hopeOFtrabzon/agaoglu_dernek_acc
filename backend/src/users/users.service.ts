import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async create(data: Prisma.UserCreateInput): Promise<UserResponseDto> {
    const user = await this.prisma.user.create({ data });
    return this.toResponseDto(user);
  }

  async update(id: string, updateDto: UpdateUserDto): Promise<UserResponseDto> {
    const data: Prisma.UserUpdateInput = {};
    if (updateDto.username !== undefined) {
      data.username = updateDto.username;
    }
    if (updateDto.first_name !== undefined) {
      data.firstName = updateDto.first_name;
    }
    if (updateDto.last_name !== undefined) {
      data.lastName = updateDto.last_name;
    }
    const user = await this.prisma.user.update({
      where: { id },
      data,
    });
    return this.toResponseDto(user);
  }

  async ensureExists(id: string): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }

  toResponseDto(user: User): UserResponseDto {
    const { password, ...rest } = user;
    return {
      id: rest.id,
      email: rest.email,
      username: rest.username,
      first_name: rest.firstName,
      last_name: rest.lastName,
      is_active: rest.isActive,
      is_superuser: rest.isSuperuser,
      is_verified: rest.isVerified,
      created_at: rest.createdAt,
      updated_at: rest.updatedAt,
    };
  }
}
