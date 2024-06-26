import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSubscriptionDto {
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsNotEmpty()
  @IsString()
  fund_id: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsString()
  endDate: string;

  @IsNotEmpty()
  @IsEnum(['sms', 'email'])
  notification_type: 'sms' | 'email';

  @IsNotEmpty()
  @IsString()
  notification_contact: string;
}