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
exports.ProfitsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let ProfitsService = class ProfitsService {
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
    async create(userId, dto) {
        const profit = await this.prisma.profit.create({
            data: {
                description: dto.description,
                source: dto.source,
                amount: new client_1.Prisma.Decimal(dto.amount),
                date: new Date(dto.date),
                userId,
            },
        });
        return this.toDto(profit);
    }
    async update(userId, id, dto) {
        await this.ensureOwnership(userId, id);
        const data = {};
        if (dto.description !== undefined)
            data.description = dto.description;
        if (dto.source !== undefined)
            data.source = dto.source;
        if (dto.amount !== undefined)
            data.amount = new client_1.Prisma.Decimal(dto.amount);
        if (dto.date !== undefined)
            data.date = new Date(dto.date);
        const profit = await this.prisma.profit.update({
            where: { id },
            data,
        });
        return this.toDto(profit);
    }
    async delete(userId, id) {
        await this.ensureOwnership(userId, id);
        await this.prisma.profit.delete({ where: { id } });
    }
    async ensureOwnership(userId, id) {
        const profit = await this.prisma.profit.findUnique({ where: { id } });
        if (!profit) {
            throw new common_1.NotFoundException('Profit not found.');
        }
        if (profit.userId !== userId) {
            throw new common_1.ForbiddenException('You can only update your own profits.');
        }
        return profit;
    }
    toDto(profit) {
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
};
exports.ProfitsService = ProfitsService;
exports.ProfitsService = ProfitsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProfitsService);
//# sourceMappingURL=profits.service.js.map