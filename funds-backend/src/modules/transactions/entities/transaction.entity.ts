export class Transaction {
    constructor(
      public id: string,
      public user_id: string,
      public fund_id: string,
      public type: 'subscription' | 'cancellation',
      public amount: number,
      public created_at: Date,
      public endDate?: Date,
    ) {}
}