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
      createSubscriptionDto.fundId,
    );

    if (createSubscriptionDto.amount < fund.minimumAmount) {
      throw new BadRequestException(
        `Minimum amount for this fund is ${fund.minimumAmount}`,
      );
    }

    if (createSubscriptionDto.amount > this.initialBalance) {
      throw new BadRequestException(
        `No tiene saldo disponible para vincularse al fondo ${fund.name}`,
      );
    }

    const subscription = new Subscription(
      randomUUID(),
      createSubscriptionDto.userId,
      createSubscriptionDto.fundId,
      createSubscriptionDto.amount,
      'active',
      new Date(),
      createSubscriptionDto.notificationType,
      createSubscriptionDto.notificationContact,
    );

    const client = this.dynamoDBService.getClient();
    const command = new PutItemCommand({
      TableName: this.tableName,
      Item: this.mapToDbItem(subscription),
    });

    await client.send(command);
    this.initialBalance -= createSubscriptionDto.amount;

    await this.transactionsService.createTransaction({
      userId: subscription.userId,
      fundId: subscription.fundId,
      type: 'subscription',
      amount: subscription.amount,
    });
    await this.notificationsService.sendSMS('+57'+subscription.notificationContact, `Te acabas de suscribir a ${fund.name}`)

    return subscription;
  }

  async cancelSubscription(id: string): Promise<Subscription> {
    const subscription = await this.getSubscriptionById(id);
    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
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
        userId: subscription.userId,
        fundId: subscription.fundId,
        type: 'cancellation',
        amount: subscription.amount,
        endDate,
      });
    // Actualizar el objeto subscription antes de devolverlo
    subscription.status = 'canceled';
    subscription.endDate = endDate;
    return subscription;
  }

  async getSubscriptionsByUser(userId: string): Promise<Subscription[]> {
    const client = this.dynamoDBService.getClient();
    const command = new ScanCommand({
      TableName: this.tableName,
      FilterExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': { S: userId },
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
      userId: { S: subscription.userId },
      fundId: { S: subscription.fundId.toString() },
      amount: { N: subscription.amount.toString() },
      status: { S: subscription.status },
      createdAt: { S: subscription.createdAt.toISOString() },
      notificationType: { S: subscription.notificationType },
      notificationContact: { S: subscription.notificationContact },
      ...(subscription.endDate && { endDate: { S: subscription.endDate.toISOString() } }),
    };
  }

  private mapToDomain(item: Record<string, any>): Subscription {
    return new Subscription(
      item.id.S,
      item.userId.S,
      item.fundId.S,
      parseInt(item.amount.N),
      item.status.S as 'active' | 'canceled',
      new Date(item.createdAt.S),
      item.notificationType.S as 'sms' | 'email',
      item.notificationContact.S,
      item.endDate ? new Date(item.endDate.S) : undefined
    );
  }
}
