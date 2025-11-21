import { Test, TestingModule } from '@nestjs/testing';
import { Prisma, Expense, Profit } from '@prisma/client';
import { Workbook } from 'exceljs';
import { PrismaService } from '../prisma/prisma.service';
import { ReportsService } from './reports.service';

type PrismaMock = {
  profit: { findMany: jest.Mock }; 
  expense: { findMany: jest.Mock };
};

const buildProfit = (overrides: Partial<Profit>): Profit => ({
  id: overrides.id ?? 1,
  description: overrides.description ?? 'Gelir',
  source: overrides.source ?? 'Aidatlar',
  amount: overrides.amount ?? new Prisma.Decimal(1000),
  date: overrides.date ?? new Date('2024-01-01'),
  userId: overrides.userId ?? 'user-1',
  createdAt: overrides.createdAt ?? new Date('2024-01-01T00:00:00Z'),
});

const buildExpense = (overrides: Partial<Expense>): Expense => ({
  id: overrides.id ?? 1,
  description: overrides.description ?? 'Gider',
  category: overrides.category ?? 'Elektrik',
  amount: overrides.amount ?? new Prisma.Decimal(500),
  date: overrides.date ?? new Date('2024-01-01'),
  userId: overrides.userId ?? 'user-1',
  createdAt: overrides.createdAt ?? new Date('2024-01-01T00:00:00Z'),
});

describe('ReportsService', () => {
  let service: ReportsService;
  let prismaMock: PrismaMock;

  beforeEach(async () => {
    prismaMock = {
      profit: { findMany: jest.fn() },
      expense: { findMany: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
  });

  it('creates a workbook with profits and expenses sheets', async () => {
    prismaMock.profit.findMany.mockResolvedValue([
      buildProfit({ description: 'Aidat Geliri', amount: new Prisma.Decimal(1500) }),
    ]);
    prismaMock.expense.findMany.mockResolvedValue([
      buildExpense({ description: 'Kira', amount: new Prisma.Decimal(800) }),
    ]);

    const buffer = await service.generateProfitExpenseWorkbook('user-1');

    const workbook = new Workbook();
    await workbook.xlsx.load(buffer as any);

    const profitsSheet = workbook.getWorksheet('Gelirler');
    const expensesSheet = workbook.getWorksheet('Giderler');

    expect(profitsSheet?.actualRowCount).toBe(2); // header + 1 row
    expect(expensesSheet?.actualRowCount).toBe(2);
    expect(profitsSheet?.getCell('A2').value).toBe('Aidat Geliri');
    expect(expensesSheet?.getCell('A2').value).toBe('Kira');
  });
});
