import { Controller, Post, Body } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Post('sms')
  async sendSMS(@Body() body: { to: string; message: string }) {
    await this.notificationsService.sendSMS(body.to, body.message);
    return { success: true, message: 'SMS sent successfully' };
  }
}