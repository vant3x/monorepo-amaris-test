import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';

@Injectable()
export class NotificationsService {
  private twilioClient: twilio.Twilio;

  constructor(private configService: ConfigService) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    this.twilioClient = twilio(accountSid, authToken);
  }

  async sendSMS(to: string, body: string): Promise<void> {
    try {
      await this.twilioClient.messages.create({
        body: body,
        from: this.configService.get<string>('TWILIO_PHONE_NUMBER'),
        to: to,
      });
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw new Error('Failed to send SMS');
    }
  }

  async sendEmail(to: string, body: string) {
    
  }
}