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
        }));        this.subscriptions = subscriptions;
        this.transactions = transactions.map(transaction => ({
          ...transaction,
          fundName: this.getFundName(transaction.fundId)
        }));
        this.latestTransactions = this.transactions.slice(0, 3); 

        this.cdr.detectChanges(); 
      },
      (error) => {
        console.error('Error loading data:', error);
      }
    );
  }

  loadFunds(): void {
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

  loadTransactions(): void {
    this.transactionsService.getTransactions(this.userId).subscribe(
      (data) => {
        this.transactions = data.map(transaction => ({
          ...transaction,
          fundName: this.getFundName(transaction.fundId)
        }));
      },
      (error) => {
        console.error('Error fetching transactions:', error);
      }
    );
  }

  getFundName(fundId: string): string {
    const fund = this.funds.find(f => f.id === fundId);
    return fund ? fund.name : 'Fondo desconocido';
  }
}