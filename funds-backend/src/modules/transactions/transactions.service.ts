// transactions.service.ts
import { Injectable } from '@nestjs/common';
import { DynamoDBService } from '../../infrastructure/database/dynamodb.service';
import { Transaction } from './entities/transaction.entity';
import { PutItemCommand, QueryCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import { randomUUID } from 'crypto';

@Injectable()
export class TransactionsService {
  private readonly tableName = 'Transactions';

  constructor(private dynamoDBService: DynamoDBService) {}

  async createTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'> ): Promise<Transaction> {
    const newTransaction = new Transaction(
    `TRA-${randomUUID()}`,
      transaction.userId,
      transaction.fundId,
      transaction.type,
      transaction.amount,
      new Date()
    );

    const client = this.dynamoDBService.getClient();
    const command = new PutItemCommand({
      TableName: this.tableName,
      Item: this.mapToDbItem(newTransaction),
    });

    await client.send(command);
    return newTransaction;
  }

  async getTransactionsByUser(userId: string): Promise<Transaction[]> {
    const client = this.dynamoDBService.getClient();
    const command = new ScanCommand({
      TableName: this.tableName,
      FilterExpression: 'userId = :userId',
      ExpressionAttributeValues: { ':userId': { S: userId } },
    });
    
    const result = await client.send(command);
    return result.Items.map(this.mapToDomain);
  }

  private mapToDbItem(transaction: Transaction): Record<string, any> {
    return {
      id: { S: transaction.id },
      userId: { S: transaction.userId },
      fundId: { S: transaction.fundId },
      type: { S: transaction.type },
      amount: { N: transaction.amount.toString() },
      createdAt: { S: transaction.createdAt.toISOString() },
    };
  }

  private mapToDomain(item: Record<string, any>): Transaction {
    return new Transaction(
      item.id.S,
      item.userId.S,
      item.fundId.S,
      item.type.S as 'subscription' | 'cancellation',
      parseInt(item.amount.N),
      new Date(item.createdAt.S)
    );
  }
}