export class Subscription {
  constructor(
    public id: string,
    public userId: string,
    public fundId: string,
    public amount: number,
    public status: 'active' | 'canceled',
    public createdAt: Date,
    public notificationType: 'sms' | 'email',
    public notificationContact: string,
    public endDate?: Date
  ) {}
}