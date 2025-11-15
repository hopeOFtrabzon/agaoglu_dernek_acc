import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SummaryDto } from './dto/summary.dto';

@Injectable()
export class SummaryService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(userId: string): Promise<SummaryDto> {
    const where: Prisma.ExpenseWhereInput = { userId };

    const [expenseSum, profitSum] = await Promise.all([
      this.prisma.expense.aggregate({
        _sum: { amount: true },
        where,
      }),
      this.prisma.profit.aggregate({
        _sum: { amount: true },
        where: { userId },
      }),
    ]);

    const totalExpenses = expenseSum._sum.amount?.toNumber() ?? 0;
    const totalProfits = profitSum._sum.amount?.toNumber() ?? 0;

    return {
      total_expenses: totalExpenses,
      total_profits: totalProfits,
      net: totalProfits - totalExpenses,
    };
  }
}
