import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DynamoDBService } from '../../infrastructure/database/dynamodb.service';
import { Subscription } from './entities/subscription.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { FundsService } from '../funds/funds.service';
import {
  PutItemCommand,
  GetItemCommand,
  QueryCommand,
  UpdateItemCommand,
  ScanCommand,
} from '@aws-sdk/client-dynamodb';
import { randomUUID } from 'crypto';
import { TransactionsService } from '../transactions/transactions.service';
import { CancelSubscriptionResponse } from './interfaces/CancelSubscriptionResponse.interface';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class SubscriptionsService {
  private readonly tableName = 'Subscriptions';
  private initialBalance: number;

  constructor(
    private dynamoDBService: DynamoDBService,
    private fundsService: FundsService,
    private transactionsService: TransactionsService,
    private notificationsService: NotificationsService,
    private configService: ConfigService,
  ) {
    this.initialBalance =
      this.configService.get<number>('initialBalance') || 500000;
  }

  async createSubscription(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<Subscription> {
    const fund = await this.fundsService.getFundById(
      createSubscriptionDto.fund_id,
    );

    if (createSubscriptionDto.amount < fund.minimum_amount) {
      throw new BadRequestException(
        `Minimum amount for this fund is ${fund.minimum_amount}`,
      );
    }

    if (createSubscriptionDto.amount > this.initialBalance) {
      throw new BadRequestException(
        `No tiene saldo disponible para vincularse al fondo ${fund.name}`,
      );
    }

    const subscription = new Subscription(
      randomUUID(),
      createSubscriptionDto.user_id,
      createSubscriptionDto.fund_id,
      createSubscriptionDto.amount,
      'active',
      new Date(),
      createSubscriptionDto.notification_type,
      createSubscriptionDto.notification_contact,
    );

    const client = this.dynamoDBService.getClient();
    const command = new PutItemCommand({
      TableName: this.tableName,
      Item: this.mapToDbItem(subscription),
    });

    await client.send(command);
    this.initialBalance -= createSubscriptionDto.amount;

    await this.transactionsService.createTransaction({
      user_id: subscription.user_id,
      fund_id: subscription.fund_id,
      type: 'subscription',
      amount: subscription.amount,
    });
    await this.notificationsService.sendSMS('+57'+subscription.notification_contact, `Te acabas de suscribir a ${fund.name}`)

    return subscription;
  }

  async cancelSubscription(id: string): Promise<Subscription> {
    const subscription = await this.getSubscriptionById(id);
    if (!subscription) {
      throw new NotFoundException(`La Subscripción con el ID ${id} no se encontró`);
    }

    const client = this.dynamoDBService.getClient();
    const command = new UpdateItemCommand({
      TableName: this.tableName,
      Key: { id: { S: id } },
      UpdateExpression: 'SET #status = :status',
      ExpressionAttributeNames: { '#status': 'status' },
      ExpressionAttributeValues: { ':status': { S: 'canceled' } },
    });
    await client.send(command);

    this.initialBalance += subscription.amount;
    const endDate = new Date();
    const canceledSubscription =
      await this.transactionsService.createTransaction({
        user_id: subscription.user_id,
        fund_id: subscription.fund_id,
        type: 'cancellation',
        amount: subscription.amount,
        endDate,
      });
    subscription.status = 'canceled';
    subscription.endDate = endDate;
    return subscription;
  }

  async getSubscriptionsByUser(userId: string): Promise<Subscription[]> {
    const client = this.dynamoDBService.getClient();
    const command = new ScanCommand({
      TableName: this.tableName,
      FilterExpression: 'user_id = :user_id',
      ExpressionAttributeValues: {
        ':user_id': { S: userId },
      },
    });
    const result = await client.send(command);
    return result.Items.map(this.mapToDomain);
  }

  private async getSubscriptionById(id: string): Promise<Subscription | null> {
    const client = this.dynamoDBService.getClient();
    const command = new GetItemCommand({
      TableName: this.tableName,
      Key: { id: { S: id } },
    });
    const result = await client.send(command);
    return result.Item ? this.mapToDomain(result.Item) : null;
  }

  private mapToDbItem(subscription: Subscription): Record<string, any> {
    return {
      id: { S: subscription.id },
      user_id: { S: subscription.user_id },
      fund_id: { S: subscription.fund_id.toString() },
      amount: { N: subscription.amount.toString() },
      status: { S: subscription.status },
      created_at: { S: subscription.created_at.toISOString() },
      notification_type: { S: subscription.notification_type },
      notification_contact: { S: subscription.notification_contact },
      ...(subscription.endDate && { endDate: { S: subscription.endDate.toISOString() } }),
    };
  }

  private mapToDomain(item: Record<string, any>): Subscription | null {
    if (!item || !item.id || !item.user_id || !item.fund_id || !item.amount || !item.status || !item.created_at) {
      return null;
    }
  
    return new Subscription(
      item.id.S,
      item.user_id.S,
      item.fund_id.S,
      parseInt(item.amount.N),
      item.status.S as 'active' | 'canceled',
      new Date(item.created_at.S),
      item.notification_type?.S as 'sms' | 'email',
      item.notification_contact?.S,
      item.endDate ? new Date(item.endDate.S) : undefined
    );
  }
}
