import { Controller, Post, Body, Param, Get, Put } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { Subscription } from './entities/subscription.entity';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  async createSubscription(@Body() createSubscriptionDto: CreateSubscriptionDto): Promise<Subscription> {
    return this.subscriptionsService.createSubscription(createSubscriptionDto);
  }

  @Put(':id/cancel')
  async cancelSubscription(@Param('id') id: string)  {
    await this.subscriptionsService.cancelSubscription(id);
  }

  @Get('user/:userId')
  async getSubscriptionsByUser(@Param('userId') userId: string): Promise<Subscription[]> {
    return this.subscriptionsService.getSubscriptionsByUser(userId);
  }


  @Get(':subscriptionId')
 async getSubscriptionById(@Param('id') id: string){  
    return 'hola'
 }
}