import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

import { Fund } from 'src/app/core/models/fund.model';
import { Subscription } from 'src/app/core/models/subscription.model';
import { SubscriptionFund } from 'src/app/core/models/suscriptionFund.model';
import { Transaction } from 'src/app/core/models/transaction.model';
import { FundService } from 'src/app/core/services/fund.service';
import { SubscriptionService } from 'src/app/core/services/subscription.service';
import { TransactionsService } from 'src/app/core/services/transactions.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-funds-list',
  templateUrl: './funds-list.component.html',
  styleUrls: ['./funds-list.component.css'],
})
export class FundsListComponent implements OnInit {
  userId: string = '';
  userBalance: string = '500000';
  funds: SubscriptionFund[] = [];
  subscriptions: Subscription[] = [];
  transactions: (Transaction & { fundName?: string })[] = [];
  latestTransactions: (Transaction & { fundName?: string })[] = []; 

  constructor(
    private fundService: FundService,
    private subscriptionService: SubscriptionService,
    private transactionsService: TransactionsService, 
    private cdr: ChangeDetectorRef

  ) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId') ?? '';
    this.userBalance = localStorage.getItem('userBalance') ?? '';
    this.loadAllData();
  }

  loadAllData(): void {
    forkJoin({
      funds: this.fundService.getAllFunds(),
      subscriptions: this.subscriptionService.getSubscriptionsByUser(this.userId),
      transactions: this.transactionsService.getTransactions(this.userId)
    }).subscribe(
      ({ funds, subscriptions, transactions }) => {
        this.funds = funds.map(fund => ({
          ...fund,
          isSubscribed: subscriptions.some(sub => sub.fund_id === fund.id && sub.status === 'active'),
          subscription: subscriptions.find(sub => sub.fund_id === fund.id && sub.status === 'active')
        }));
  
        this.subscriptions = subscriptions;
        this.transactions = transactions.map(transaction => ({
          ...transaction,
          fundName: this.getFundName(transaction.fund_id)
        }));
  

        this.transactions.sort((a, b) => {
          const dateA: Date = new Date(a.created_at);
          const dateB: Date = new Date(b.created_at);
          return dateB.getTime() - dateA.getTime(); 
        });

        this.latestTransactions = this.transactions.slice(0, 3); 
        this.updateUserBalance();

        this.cdr.detectChanges(); 
      },
      (error) => {
        console.error('Error loading data:', error);
      }
    );
  }

  updateUserBalance(): void {
    this.userBalance = localStorage.getItem('userBalance') ?? '500000';
  }

  onSubscriptionChanged(): void {
    this.loadAllData();
  }

 /* loadFunds(): void {
    this.fundService.getAllFunds().subscribe(
      (funds) => {
        this.funds = funds.map(fund => ({
          ...fund,
          isSubscribed: false,
          subscription: undefined
        })) as SubscriptionFund[];
      },
      (error) => {
        console.error('Error loading funds:', error);
      }
    );
  }
*/
  loadSubscriptions() {
    this.subscriptionService.getSubscriptionsByUser(this.userId).subscribe(
      (subscriptions) => {
        this.subscriptions = subscriptions;
      },
      (error) => {
        console.error('Error fetching subscriptions:', error);
      }
    );
  }


  getFundName(fundId: string): string {
    if (!this.funds || this.funds.length === 0) {
      console.warn('La lista de fondos está vacía');
      return `Fondo ${fundId}`;
    }
  
    const fund = this.funds.find(f => f.id === fundId);
    if (!fund) {
      console.warn(`No se encontró el fondo con ID: ${fundId}`);
      return `Fondo desconocido`;
    }
  
    return fund.name;
  }
}