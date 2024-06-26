import { Test, TestingModule } from '@nestjs/testing';
import { FundsController } from './funds.controller';
import { FundsService } from './funds.service';
import { CreateFundDto } from './dto/create-fund.dto';
import { Fund } from './entities/fund.entity';
import { NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';

const mockFundsService = {
  createFund: jest.fn(),
  getFundById: jest.fn(),
  getAllFunds: jest.fn(),
};

describe('FundsController', () => {
  let controller: FundsController;
  let fundsService: FundsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FundsController],
      providers: [{ provide: FundsService, useValue: mockFundsService }],
    }).compile();

    controller = module.get<FundsController>(FundsController);
    fundsService = module.get<FundsService>(FundsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createFund', () => {
    it('should create a fund successfully', async () => {
      const createFundDto: CreateFundDto = {
        name: 'Test Fund',
        minimum_amount: 1000,
        category: 'Test Category',
        id: randomUUID()
      };

      const expectedResult = new Fund('1', 'Test Fund', 1000, 'Test Category');
      mockFundsService.createFund.mockResolvedValue(expectedResult);

      const result = await controller.createFund(createFundDto);

      expect(result).toEqual(expectedResult);
      expect(fundsService.createFund).toHaveBeenCalledWith(createFundDto);
    });
  });

  describe('getFund', () => {
    it('should return a fund when it exists', async () => {
      const expectedResult = new Fund('1', 'Test Fund', 1000, 'Test Category');
      mockFundsService.getFundById.mockResolvedValue(expectedResult);

      const result = await controller.getFund('1');

      expect(result).toEqual(expectedResult);
      expect(fundsService.getFundById).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when fund does not exist', async () => {
      mockFundsService.getFundById.mockResolvedValue(null);

      await expect(controller.getFund('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAllFunds', () => {
    it('should return all funds', async () => {
      const expectedResult = [
        new Fund('1', 'Fund 1', 1000, 'Category 1'),
        new Fund('2', 'Fund 2', 2000, 'Category 2'),
      ];
      mockFundsService.getAllFunds.mockResolvedValue(expectedResult);

      const result = await controller.getAllFunds();

      expect(result).toEqual(expectedResult);
      expect(fundsService.getAllFunds).toHaveBeenCalled();
    });
  });
});
