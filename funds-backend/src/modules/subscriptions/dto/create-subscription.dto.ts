import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSubscriptionDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  fundId: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsString()
  endDate: string;

  @IsNotEmpty()
  @IsEnum(['sms', 'email'])
  notificationType: 'sms' | 'email';

  @IsNotEmpty()
  @IsString()
  notificationContact: string;
}