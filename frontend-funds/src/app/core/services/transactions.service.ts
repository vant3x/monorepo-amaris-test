import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction.model';


@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  private apiUrl = 'http://localhost:3000/api/v1/transactions';
  constructor(private http: HttpClient) { }

  getTransactions(userId: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/user/${userId}`);
  }

  createTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/transactions`, transaction);
  }
}