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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    usersService;
    jwtService;
    configService;
    constructor(usersService, jwtService, configService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async register(registerDto) {
        const existingUser = await this.usersService.findByEmail(registerDto.email);
        if (existingUser) {
            throw new common_1.BadRequestException('Email already registered.');
        }
        const existingUsername = await this.usersService.findByUsername(registerDto.username);
        if (existingUsername) {
            throw new common_1.BadRequestException('Username already exists.');
        }
        const saltRounds = Number(this.configService.get('BCRYPT_SALT_ROUNDS', 12));
        const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);
        const user = await this.usersService.create({
            email: registerDto.email,
            username: registerDto.username,
            password: hashedPassword,
            firstName: registerDto.first_name ?? undefined,
            lastName: registerDto.last_name ?? undefined,
        });
        return user;
    }
    async login(loginDto) {
        const user = await this.usersService.findByEmail(loginDto.username);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials.');
        }
        const passwordMatches = await bcrypt.compare(loginDto.password, user.password);
        if (!passwordMatches) {
            throw new common_1.UnauthorizedException('Invalid credentials.');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('User is inactive.');
        }
        const payload = {
            sub: user.id,
            email: user.email,
        };
        const expiresIn = Number(this.configService.get('ACCESS_TOKEN_EXPIRES_IN_MINUTES', 30)) * 60;
        const accessToken = await this.jwtService.signAsync(payload, {
            expiresIn,
        });
        return {
            access_token: accessToken,
            token_type: 'bearer',
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map