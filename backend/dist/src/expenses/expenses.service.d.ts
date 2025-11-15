import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { ExpenseDto } from './dto/expense.dto';
import { ListExpensesDto } from './dto/list-expenses.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
export declare class ExpensesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(userId: string, filters: ListExpensesDto): Promise<ExpenseDto[]>;
    create(userId: string, dto: CreateExpenseDto): Promise<ExpenseDto>;
    update(userId: string, id: number, dto: UpdateExpenseDto): Promise<ExpenseDto>;
    delete(userId: string, id: number): Promise<void>;
    private ensureOwnership;
    private toDto;
}
