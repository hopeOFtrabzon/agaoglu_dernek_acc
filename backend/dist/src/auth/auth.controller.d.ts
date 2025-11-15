import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<import("../users/dto/user-response.dto").UserResponseDto>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        token_type: string;
    }>;
    logout(): {
        detail: string;
    };
}
