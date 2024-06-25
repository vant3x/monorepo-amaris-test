export interface Subscription {
  id: string;
  userId: string;
  fundId: string;
  amount: number;
  status: 'active' | 'canceled';
  createdAt: Date;
  endDate?: Date;
}
