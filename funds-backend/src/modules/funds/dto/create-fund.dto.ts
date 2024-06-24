import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateFundDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  minimumAmount: number;

  @IsNotEmpty()
  @IsString()
  category: string;
}