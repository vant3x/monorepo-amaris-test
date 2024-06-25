import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTransactionsDto {
    @IsString()
    userId: string;
  
    @IsNotEmpty()
    @IsString()
    fundId: string;

    @IsString()
    type: string;

    @IsNumber()
    amount: number;

    createdAt: Date;
}