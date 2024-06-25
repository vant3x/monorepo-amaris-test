export class Transaction {
    constructor(
      public id: string,
      public userId: string,
      public fundId: string,
      public type: 'subscription' | 'cancellation',
      public amount: number,
      public createdAt: Date,
      public endDate?: Date,
    ) {}
  }