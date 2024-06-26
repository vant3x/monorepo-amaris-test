export interface Transaction {
    id: string;
    user_id: string;
    fund_id: string;
    type: 'subscription' | 'cancellation';
    amount: number;
    created_at: Date;
    endDate?: Date; 
  }