import { Test, TestingModule } from '@nestjs/testing';
import { FundsService } from './funds.service';
import { DynamoDBService } from '../../infrastructure/database/dynamodb.service';
import { CreateFundDto } from './dto/create-fund.dto';
import { Fund } from './entities/fund.entity';
import { NotFoundException } from '@nestjs/common';

const mockDynamoDBService = {
  getClient: jest.fn().mockReturnValue({
    send: jest.fn(),
  }),
};

describe('FundsService', () => {
  let service: FundsService;
  let dynamoDBService: DynamoDBService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FundsService,
        { provide: DynamoDBService, useValue: mockDynamoDBService },
      ],
    }).compile();

    service = module.get<FundsService>(FundsService);
    dynamoDBService = module.get<DynamoDBService>(DynamoDBService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createFund', () => {
    it('should create a fund successfully', async () => {
      const createFundDto: CreateFundDto = {
        name: 'Test Fund',
        minimum_amount: 1000,
        category: 'Test Category',
      };

      const result = await service.createFund(createFundDto);

      expect(result).toBeInstanceOf(Fund);
      expect(result.name).toBe(createFundDto.name);
      expect(result.minimum_amount).toBe(createFundDto.minimum_amount);
      expect(result.category).toBe(createFundDto.category);
      expect(dynamoDBService.getClient().send).toHaveBeenCalled();
    });
  });

  describe('getFundById', () => {
    it('should return a fund when it exists', async () => {
      const mockFund = {
        Item: {
          id: { S: '1' },
          name: { S: 'Test Fund' },
          minimum_amount: { N: '1000' },
          category: { S: 'Test Category' },
        },
      };

      mockDynamoDBService.getClient().send.mockResolvedValueOnce(mockFund);

      const result = await service.getFundById('1');

      expect(result).toBeInstanceOf(Fund);
      expect(result.id).toBe('1');
      expect(result.name).toBe('Test Fund');
      expect(result.minimum_amount).toBe(1000);
      expect(result.category).toBe('Test Category');
    });

    it('should throw NotFoundException when fund does not exist', async () => {
      mockDynamoDBService.getClient().send.mockResolvedValueOnce({ Item: null });

      await expect(service.getFundById('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAllFunds', () => {
    it('should return all funds', async () => {
      const mockFunds = {
        Items: [
          {
            id: { S: '1' },
            name: { S: 'Fund 1' },
            minimum_amount: { N: '1000' },
            category: { S: 'Category 1' },
          },
          {
            id: { S: '2' },
            name: { S: 'Fund 2' },
            minimum_amount: { N: '2000' },
            category: { S: 'Category 2' },
          },
        ],
      };

      mockDynamoDBService.getClient().send.mockResolvedValueOnce(mockFunds);

      const result = await service.getAllFunds();

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Fund);
      expect(result[1]).toBeInstanceOf(Fund);
    });
  });
});