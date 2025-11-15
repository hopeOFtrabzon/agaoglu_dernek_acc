import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Profit } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfitDto } from './dto/create-profit.dto';
import { ListProfitsDto } from './dto/list-profits.dto';
import { ProfitDto } from './dto/profit.dto';
import { UpdateProfitDto } from './dto/update-profit.dto';

@Injectable()
export class ProfitsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string, filters: ListProfitsDto): Promise<ProfitDto[]> {
    const where: Prisma.ProfitWhereInput = {
      userId,
    };

    if (filters.search) {
      where.description = { contains: filters.search, mode: 'insensitive' };
    }
    if (filters.source) {
      where.source = { contains: filters.source, mode: 'insensitive' };
    }
    if (filters.startDate || filters.endDate) {
      where.date = {};
      if (filters.startDate) {
        where.date.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        where.date.lte = new Date(filters.endDate);
      }
    }

    const profits = await this.prisma.profit.findMany({
      where,
      orderBy: { date: 'desc' },
    });
    return profits.map((profit) => this.toDto(profit));
  }

  async create(userId: string, dto: CreateProfitDto): Promise<ProfitDto> {
    const profit = await this.prisma.profit.create({
      data: {
        description: dto.description,
        source: dto.source,
        amount: new Prisma.Decimal(dto.amount),
        date: new Date(dto.date),
        userId,
      },
    });
    return this.toDto(profit);
  }

  async update(userId: string, id: number, dto: UpdateProfitDto): Promise<ProfitDto> {
    await this.ensureOwnership(userId, id);

    const data: Prisma.ProfitUpdateInput = {};
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.source !== undefined) data.source = dto.source;
    if (dto.amount !== undefined) data.amount = new Prisma.Decimal(dto.amount);
    if (dto.date !== undefined) data.date = new Date(dto.date);

    const profit = await this.prisma.profit.update({
      where: { id },
      data,
    });
    return this.toDto(profit);
  }

  async delete(userId: string, id: number): Promise<void> {
    await this.ensureOwnership(userId, id);
    await this.prisma.profit.delete({ where: { id } });
  }

  private async ensureOwnership(userId: string, id: number): Promise<Profit> {
    const profit = await this.prisma.profit.findUnique({ where: { id } });
    if (!profit) {
      throw new NotFoundException('Profit not found.');
    }
    if (profit.userId !== userId) {
      throw new ForbiddenException('You can only update your own profits.');
    }
    return profit;
  }

  private toDto(profit: Profit): ProfitDto {
    return {
      id: profit.id,
      description: profit.description,
      amount: profit.amount.toNumber(),
      source: profit.source,
      date: profit.date.toISOString().split('T')[0],
      createdAt: profit.createdAt,
      userId: profit.userId,
    };
  }
}
