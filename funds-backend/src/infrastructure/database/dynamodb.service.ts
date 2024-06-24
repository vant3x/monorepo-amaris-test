import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';


@Injectable()
export class DynamoDBService {
  private client: DynamoDBClient;

  constructor(private configService: ConfigService) {
    this.client = new DynamoDBClient({
      region: this.configService.get<string>('aws.region'),
      credentials: {
        accessKeyId: this.configService.get<string>('aws.accessKeyId'),
        secretAccessKey: this.configService.get<string>('aws.secretAccessKey'),
      },
    });
  }

  getClient(): DynamoDBClient {
    return this.client;
  }
}