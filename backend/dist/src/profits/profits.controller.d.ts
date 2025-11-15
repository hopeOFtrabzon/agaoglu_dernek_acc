import { UserResponseDto } from '../users/dto/user-response.dto';
import { CreateProfitDto } from './dto/create-profit.dto';
import { ListProfitsDto } from './dto/list-profits.dto';
import { UpdateProfitDto } from './dto/update-profit.dto';
import { ProfitsService } from './profits.service';
export declare class ProfitsController {
    private readonly profitsService;
    constructor(profitsService: ProfitsService);
    list(user: UserResponseDto, filters: ListProfitsDto): Promise<import("./dto/profit.dto").ProfitDto[]>;
    create(user: UserResponseDto, dto: CreateProfitDto): Promise<import("./dto/profit.dto").ProfitDto>;
    update(user: UserResponseDto, id: number, dto: UpdateProfitDto): Promise<import("./dto/profit.dto").ProfitDto>;
    delete(user: UserResponseDto, id: number): Promise<void>;
}
