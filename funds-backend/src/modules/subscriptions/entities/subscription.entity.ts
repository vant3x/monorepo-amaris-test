export class Subscription {
  constructor(
    public id: string,
    public user_id: string,
    public fund_id: string,
    public amount: number,
    public status: 'active' | 'canceled',
    public created_at: Date,
    public notification_type: 'sms' | 'email',
    public notification_contact: string,
    public endDate?: Date
  ) {}
}