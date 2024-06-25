import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Transaction } from 'src/app/core/models/transaction.model';
import { TransactionsService } from 'src/app/core/services/transactions.service';
import { UserIdService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.css']
})
export class TransactionHistoryComponent implements AfterViewInit {
  displayedColumns: string[] = ['id', 'type', 'fundId', 'amount', 'createdAt'];
  dataSource = new MatTableDataSource<Transaction>([]);
  userId: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private transactionsService: TransactionsService,
    private userIdService: UserIdService
  ) { }

  ngOnInit(): void {
    this.userId = this.userIdService.getUserId();
    this.loadTransactions();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadTransactions(): void {
    this.transactionsService.getTransactions(this.userId).subscribe(
      (data) => {
        this.dataSource.data = data;
      },
      (error) => {
        console.error('Error fetching transactions:', error);
      }
    );
  }
}