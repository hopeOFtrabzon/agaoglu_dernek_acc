"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpensesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let ExpensesService = class ExpensesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(userId, filters) {
        const where = {
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
    async create(userId, dto) {
        const expense = await this.prisma.expense.create({
            data: {
                description: dto.description,
                category: dto.category,
                amount: new client_1.Prisma.Decimal(dto.amount),
                date: new Date(dto.date),
                userId,
            },
        });
        return this.toDto(expense);
    }
    async update(userId, id, dto) {
        await this.ensureOwnership(userId, id);
        const data = {};
        if (dto.description !== undefined)
            data.description = dto.description;
        if (dto.amount !== undefined)
            data.amount = new client_1.Prisma.Decimal(dto.amount);
        if (dto.category !== undefined)
            data.category = dto.category;
        if (dto.date !== undefined)
            data.date = new Date(dto.date);
        const expense = await this.prisma.expense.update({
            where: { id },
            data,
        });
        return this.toDto(expense);
    }
    async delete(userId, id) {
        await this.ensureOwnership(userId, id);
        await this.prisma.expense.delete({ where: { id } });
    }
    async ensureOwnership(userId, expenseId) {
        const expense = await this.prisma.expense.findUnique({ where: { id: expenseId } });
        if (!expense) {
            throw new common_1.NotFoundException('Expense not found.');
        }
        if (expense.userId !== userId) {
            throw new common_1.ForbiddenException('You can only update your own expenses.');
        }
        return expense;
    }
    toDto(expense) {
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
};
exports.ExpensesService = ExpensesService;
exports.ExpensesService = ExpensesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExpensesService);
//# sourceMappingURL=expenses.service.js.map