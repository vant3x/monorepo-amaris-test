export interface Subscription {
  id: string;
  user_id: string;
  fund_id: string;
  amount: number;
  status: 'active' | 'canceled';
  created_at: Date;
  endDate?: Date;
}
