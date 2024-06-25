import { Injectable, NotFoundException } from '@nestjs/common';
import { DynamoDBService } from '../../infrastructure/database/dynamodb.service';
import { Fund } from './entities/fund.entity';
import { CreateFundDto } from './dto/create-fund.dto';
import { PutItemCommand, GetItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import {  randomUUID } from "crypto";

@Injectable()
export class FundsService {
  private readonly tableName = 'Funds';

  constructor(private dynamoDBService: DynamoDBService) {}

  async createFund(createFundDto: CreateFundDto): Promise<Fund> {

    const newFundId = randomUUID(); 

    const fund = new Fund(
      newFundId,
      createFundDto.name,
      createFundDto.minimumAmount,
      createFundDto.category
    );

    const client = this.dynamoDBService.getClient();
    const command = new PutItemCommand({
      TableName: this.tableName,
      Item: this.mapToDbItem(fund),
    });

    await client.send(command);
    return fund;
  }

  async getFundById(id: string): Promise<Fund> {
    const client = this.dynamoDBService.getClient();
    const command = new GetItemCommand({
      TableName: this.tableName,
      Key: { id: { S: id.toString() } },
    });

    const result = await client.send(command);
    if (!result.Item) {
      throw new NotFoundException(`Fund with ID ${id} not found`);
    }
    return this.mapToDomain(result.Item);
  }

  async getAllFunds(): Promise<Fund[]> {
    const client = this.dynamoDBService.getClient();
    const command = new ScanCommand({ TableName: this.tableName });

    const result = await client.send(command);
    return result.Items.map(this.mapToDomain);
  }

  private mapToDbItem(fund: Fund): Record<string, any> {
    return {
      id: { S: fund.id.toString() },
      name: { S: fund.name },
      minimumAmount: { N: fund.minimumAmount.toString() },
      category: { S: fund.category },
    };
  }

  private mapToDomain(item: Record<string, any>): Fund {
    return new Fund(
      item.id.S,
      item.name.S,
      parseInt(item.minimumAmount.N),
      item.category.S
    );
  }
}