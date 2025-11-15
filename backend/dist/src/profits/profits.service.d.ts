import { PrismaService } from '../prisma/prisma.service';
import { CreateProfitDto } from './dto/create-profit.dto';
import { ListProfitsDto } from './dto/list-profits.dto';
import { ProfitDto } from './dto/profit.dto';
import { UpdateProfitDto } from './dto/update-profit.dto';
export declare class ProfitsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(userId: string, filters: ListProfitsDto): Promise<ProfitDto[]>;
    create(userId: string, dto: CreateProfitDto): Promise<ProfitDto>;
    update(userId: string, id: number, dto: UpdateProfitDto): Promise<ProfitDto>;
    delete(userId: string, id: number): Promise<void>;
    private ensureOwnership;
    private toDto;
}
