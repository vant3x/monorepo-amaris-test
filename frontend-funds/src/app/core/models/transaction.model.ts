export interface Transaction {
    id: string;
    userId: string;
    fundId: string;
    type: 'subscription' | 'cancellation';
    amount: number;
    createdAt: Date;
    endDate?: Date; 
  }