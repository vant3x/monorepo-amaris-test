import { IsUUID , IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateFundDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  minimum_amount: number;

  @IsNotEmpty()
  @IsString()
  category: string;
}