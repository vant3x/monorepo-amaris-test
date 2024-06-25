import { Controller, Post, Get, Param } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionsDto } from './dto/create-transaction.dto';
import { Subscription } from 'rxjs';

@Controller('transactions')
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) {

    }

    @Get('user/:userId')
    async getTransactions(@Param('userId') userId: string) {
      return this.transactionsService.getTransactionsByUser(userId);
    }
  
}
