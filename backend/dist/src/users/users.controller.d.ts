import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(user: UserResponseDto): Promise<UserResponseDto>;
    updateUser(id: string, updateDto: UpdateUserDto, currentUser: UserResponseDto): Promise<UserResponseDto>;
}
