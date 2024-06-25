export interface Subscription {
  id: string;
  user_id: string;
  fund_id: string;
  amount: number;
  status: 'active' | 'canceled';
  createdAt: Date;
  endDate?: Date;
}
