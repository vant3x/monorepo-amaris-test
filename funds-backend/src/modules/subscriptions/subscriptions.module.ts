import { Module } from '@nestjs/common';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';
import { FundsModule } from '../funds/funds.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [ FundsModule, 
    TransactionsModule,
    NotificationsModule
  ],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService]
})
export class SubscriptionsModule {}
