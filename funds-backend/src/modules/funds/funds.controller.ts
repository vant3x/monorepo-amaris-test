import { Controller, Get, Post, Body, Param, NotFoundException } from '@nestjs/common';
import { FundsService } from './funds.service';
import { CreateFundDto } from './dto/create-fund.dto';
import { Fund } from './entities/fund.entity';

@Controller('funds')
export class FundsController {
  constructor(private readonly fundsService: FundsService) {}

  

  @Post()
  async createFund(@Body() createFundDto: CreateFundDto): Promise<Fund> {
    return this.fundsService.createFund(createFundDto);
  }

  @Get(':id')
  async getFund(@Param('id') id: string): Promise<Fund> {
    const fund = await this.fundsService.getFundById(id);
    if (!fund) {
      throw new NotFoundException(`Fund with ID ${id} not found`);
    }
    return fund;
  }

  @Get()
  async getAllFunds(): Promise<Fund[]> {
    return this.fundsService.getAllFunds();
  }
}