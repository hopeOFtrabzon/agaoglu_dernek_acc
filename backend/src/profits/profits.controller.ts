import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { CreateProfitDto } from './dto/create-profit.dto';
import { ListProfitsDto } from './dto/list-profits.dto';
import { UpdateProfitDto } from './dto/update-profit.dto';
import { ProfitsService } from './profits.service';

@Controller('profits')
@UseGuards(JwtAuthGuard)
export class ProfitsController {
  constructor(private readonly profitsService: ProfitsService) {}

  @Get()
  list(@CurrentUser() user: UserResponseDto, @Query() filters: ListProfitsDto) {
    return this.profitsService.list(user.id, filters);
  }

  @Post()
  create(@CurrentUser() user: UserResponseDto, @Body() dto: CreateProfitDto) {
    return this.profitsService.create(user.id, dto);
  }

  @Put(':id')
  update(
    @CurrentUser() user: UserResponseDto,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProfitDto,
  ) {
    return this.profitsService.update(user.id, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@CurrentUser() user: UserResponseDto, @Param('id', ParseIntPipe) id: number) {
    await this.profitsService.delete(user.id, id);
  }
}
