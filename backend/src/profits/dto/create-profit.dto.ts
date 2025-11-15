import { IsDateString, IsNumber, IsString } from 'class-validator';

export class CreateProfitDto {
  @IsString()
  description!: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  amount!: number;

  @IsString()
  source!: string;

  @IsDateString()
  date!: string;
}
