import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Expense, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { ExpenseDto } from './dto/expense.dto';
import { ListExpensesDto } from './dto/list-expenses.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string, filters: ListExpensesDto): Promise<ExpenseDto[]> {
    const where: Prisma.ExpenseWhereInput = {
      userId,
    };

    if (filters.search) {
      where.description = { contains: filters.search, mode: 'insensitive' };
    }
    if (filters.category) {
      where.category = { contains: filters.category, mode: 'insensitive' };
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

    const expenses = await this.prisma.expense.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    return expenses.map((expense) => this.toDto(expense));
  }

  async create(userId: string, dto: CreateExpenseDto): Promise<ExpenseDto> {
    const expense = await this.prisma.expense.create({
      data: {
        description: dto.description,
        category: dto.category,
        amount: new Prisma.Decimal(dto.amount),
        date: new Date(dto.date),
        userId,
      },
    });
    return this.toDto(expense);
  }

  async update(userId: string, id: number, dto: UpdateExpenseDto): Promise<ExpenseDto> {
    await this.ensureOwnership(userId, id);
    const data: Prisma.ExpenseUpdateInput = {};
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.amount !== undefined) data.amount = new Prisma.Decimal(dto.amount);
    if (dto.category !== undefined) data.category = dto.category;
    if (dto.date !== undefined) data.date = new Date(dto.date);

    const expense = await this.prisma.expense.update({
      where: { id },
      data,
    });
    return this.toDto(expense);
  }

  async delete(userId: string, id: number): Promise<void> {
    await this.ensureOwnership(userId, id);
    await this.prisma.expense.delete({ where: { id } });
  }

  private async ensureOwnership(userId: string, expenseId: number): Promise<Expense> {
    const expense = await this.prisma.expense.findUnique({ where: { id: expenseId } });
    if (!expense) {
      throw new NotFoundException('Expense not found.');
    }
    if (expense.userId !== userId) {
      throw new ForbiddenException('You can only update your own expenses.');
    }
    return expense;
  }

  private toDto(expense: Expense): ExpenseDto {
    return {
      id: expense.id,
      description: expense.description,
      amount: expense.amount.toNumber(),
      category: expense.category,
      date: expense.date.toISOString().split('T')[0],
      createdAt: expense.createdAt,
      userId: expense.userId,
    };
  }
}
