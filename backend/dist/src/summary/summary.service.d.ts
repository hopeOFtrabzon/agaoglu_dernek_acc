import { PrismaService } from '../prisma/prisma.service';
import { SummaryDto } from './dto/summary.dto';
export declare class SummaryService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getSummary(userId: string): Promise<SummaryDto>;
}
