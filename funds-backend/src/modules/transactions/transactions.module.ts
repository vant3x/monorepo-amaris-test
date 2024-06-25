import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Module({
  providers: [TransactionsService],
  controllers: [TransactionsController],
  exports: [ TransactionsService ]
})
export class TransactionsModule {}
