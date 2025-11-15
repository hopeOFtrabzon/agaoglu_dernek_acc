import { UserResponseDto } from '../users/dto/user-response.dto';
import { SummaryService } from './summary.service';
export declare class SummaryController {
    private readonly summaryService;
    constructor(summaryService: SummaryService);
    getSummary(user: UserResponseDto): Promise<import("./dto/summary.dto").SummaryDto>;
}
