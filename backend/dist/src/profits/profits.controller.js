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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfitsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const user_response_dto_1 = require("../users/dto/user-response.dto");
const create_profit_dto_1 = require("./dto/create-profit.dto");
const list_profits_dto_1 = require("./dto/list-profits.dto");
const update_profit_dto_1 = require("./dto/update-profit.dto");
const profits_service_1 = require("./profits.service");
let ProfitsController = class ProfitsController {
    profitsService;
    constructor(profitsService) {
        this.profitsService = profitsService;
    }
    list(user, filters) {
        return this.profitsService.list(user.id, filters);
    }
    create(user, dto) {
        return this.profitsService.create(user.id, dto);
    }
    update(user, id, dto) {
        return this.profitsService.update(user.id, id, dto);
    }
    async delete(user, id) {
        await this.profitsService.delete(user.id, id);
    }
};
exports.ProfitsController = ProfitsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_response_dto_1.UserResponseDto, list_profits_dto_1.ListProfitsDto]),
    __metadata("design:returntype", void 0)
], ProfitsController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_response_dto_1.UserResponseDto, create_profit_dto_1.CreateProfitDto]),
    __metadata("design:returntype", void 0)
], ProfitsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_response_dto_1.UserResponseDto, Number, update_profit_dto_1.UpdateProfitDto]),
    __metadata("design:returntype", void 0)
], ProfitsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_response_dto_1.UserResponseDto, Number]),
    __metadata("design:returntype", Promise)
], ProfitsController.prototype, "delete", null);
exports.ProfitsController = ProfitsController = __decorate([
    (0, common_1.Controller)('profits'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [profits_service_1.ProfitsService])
], ProfitsController);
//# sourceMappingURL=profits.controller.js.map