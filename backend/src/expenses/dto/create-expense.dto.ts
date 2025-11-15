import { IsDateString, IsNumber, IsString } from 'class-validator';

export class CreateExpenseDto {
  @IsString()
  description!: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  amount!: number;

  @IsString()
  category!: string;

  @IsDateString()
  date!: string;
}
