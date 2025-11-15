import { UserResponseDto } from '../users/dto/user-response.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { ListExpensesDto } from './dto/list-expenses.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpensesService } from './expenses.service';
export declare class ExpensesController {
    private readonly expensesService;
    constructor(expensesService: ExpensesService);
    listExpenses(user: UserResponseDto, filters: ListExpensesDto): Promise<import("./dto/expense.dto").ExpenseDto[]>;
    createExpense(user: UserResponseDto, dto: CreateExpenseDto): Promise<import("./dto/expense.dto").ExpenseDto>;
    updateExpense(user: UserResponseDto, id: number, dto: UpdateExpenseDto): Promise<import("./dto/expense.dto").ExpenseDto>;
    deleteExpense(user: UserResponseDto, id: number): Promise<void>;
}
