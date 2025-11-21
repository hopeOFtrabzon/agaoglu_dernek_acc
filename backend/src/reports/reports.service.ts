import { Injectable } from '@nestjs/common';
import { Expense, Profit } from '@prisma/client';
import { Workbook, Worksheet } from 'exceljs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async generateProfitExpenseWorkbook(userId: string): Promise<Buffer> {
    const [profits, expenses] = await Promise.all([
      this.prisma.profit.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
      }),
      this.prisma.expense.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
      }),
    ]);

    const workbook = new Workbook();
    workbook.created = new Date();
    workbook.creator = 'Agaoglu Dernek';

    this.addProfitsSheet(workbook, profits);
    this.addExpensesSheet(workbook, expenses);

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
  }

  private addProfitsSheet(workbook: Workbook, profits: Profit[]): void {
    const worksheet = workbook.addWorksheet('Gelirler');
    worksheet.columns = [
      { header: 'Açıklama', key: 'description', width: 32 },
      { header: 'Kaynak', key: 'source', width: 24 },
      { header: 'Tarih', key: 'date', width: 16 },
      { header: 'Tutar (TRY)', key: 'amount', width: 18 },
    ];

    worksheet.addRows(
      profits.map((profit) => ({
        description: profit.description,
        source: profit.source,
        date: this.formatDate(profit.date),
        amount: profit.amount.toNumber(),
      })),
    );

    this.styleMoneyColumn(worksheet, 4);
    this.styleHeaderRow(worksheet);
  }

  private addExpensesSheet(workbook: Workbook, expenses: Expense[]): void {
    const worksheet = workbook.addWorksheet('Giderler');
    worksheet.columns = [
      { header: 'Açıklama', key: 'description', width: 32 },
      { header: 'Kategori', key: 'category', width: 24 },
      { header: 'Tarih', key: 'date', width: 16 },
      { header: 'Tutar (TRY)', key: 'amount', width: 18 },
    ];

    worksheet.addRows(
      expenses.map((expense) => ({
        description: expense.description,
        category: expense.category,
        date: this.formatDate(expense.date),
        amount: expense.amount.toNumber(),
      })),
    );

    this.styleMoneyColumn(worksheet, 4);
    this.styleHeaderRow(worksheet);
  }

  private styleHeaderRow(worksheet: Worksheet): void {
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.alignment = { vertical: 'middle', horizontal: 'left' };
    worksheet.views = [{ state: 'frozen', ySplit: 1 }];
  }

  private styleMoneyColumn(worksheet: Worksheet, columnIndex: number): void {
    const column = worksheet.getColumn(columnIndex);
    column.numFmt = '#,##0.00';
  }

  private formatDate(value: Date): string {
    return value.toISOString().split('T')[0];
  }
}
