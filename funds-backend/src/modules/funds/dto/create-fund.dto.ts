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
  minimumAmount: number;

  @IsNotEmpty()
  @IsString()
  category: string;
}