import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Fund } from 'src/app/core/models/fund.model';
import { Transaction } from 'src/app/core/models/transaction.model';
import { FundService } from 'src/app/core/services/fund.service';
import { TransactionsService } from 'src/app/core/services/transactions.service';
import { UserIdService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.css']
})
export class TransactionHistoryComponent implements AfterViewInit {
  
  displayedColumns: string[] = ['id', 'type', 'fundId', 'amount', 'created_at'];
  dataSource = new MatTableDataSource<Transaction>([]);
  userId: string = '';
  funds: Fund[] = []; 

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private transactionsService: TransactionsService,
    private fundService: FundService,
    private userIdService: UserIdService
  ) { }

  ngOnInit(): void {
    this.userId = this.userIdService.getUserId();
    this.loadFunds();
    this.loadTransactions();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadTransactions(): void {
    this.transactionsService.getTransactions(this.userId).subscribe(
      (data) => {
        this.dataSource.data = data.map(transaction => ({
          ...transaction,
          fundName: this.getFundName(transaction.fund_id)
        }));
      },
      (error) => {
        console.error('Error fetching transactions:', error);
      }
    );
  }


  loadFunds(): void {
    this.fundService.getAllFunds().subscribe(
      (funds) => {
        this.funds = funds;
      },
      (error) => {
        console.error('Error loading funds:', error);
      }
    );
  }
  getFundName(fundId: string): string {
    const fund = this.funds.find(f => f.id === fundId);
    return fund ? fund.name : 'Fondo desconocido';
  }
}