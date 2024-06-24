import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FundsModule } from './modules/funds/funds.module';
import { SharedModule } from './shared/shared.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AccountModule } from './modules/account/account.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';


@Module({
  imports: [    ConfigModule.forRoot({
    load: [configuration],
    envFilePath: '.env', 
    isGlobal: true,
  }),
  FundsModule, SharedModule,  SubscriptionsModule, TransactionsModule, NotificationsModule, AccountModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
