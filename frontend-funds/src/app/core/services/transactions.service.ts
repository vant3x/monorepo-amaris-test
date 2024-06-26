import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction.model';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  urlBase = environment.apiUrl;
  
  private apiUrl = `${this.urlBase}/api/v1/transactions`;
  constructor(private http: HttpClient) { }

  getTransactions(userId: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/user/${userId}`);
  }

  createTransaction(transaction: Omit<Transaction, 'id' | 'created_at'>): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/transactions`, transaction);
  }
}