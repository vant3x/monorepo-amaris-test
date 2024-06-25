export interface Transaction {
    id: string;
    userId: string;
    fundId: string;
    type: 'subscription' | 'cancellation';
    amount: number;
    created_at: Date;
    endDate?: Date; 
  }