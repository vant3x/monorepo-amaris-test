import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subscription } from '../models/subscription.model';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private apiUrl = 'http://localhost:3000/api/v1/subscriptions';

  constructor(private http: HttpClient) {}

  createSubscription(subscriptionData: {
    userId: string;
    fundId: string;
    amount: number;
    notificationType: 'sms' | 'email';
    notificationContact: string;
  }): Observable<Subscription> {
    return this.http.post<Subscription>(this.apiUrl, subscriptionData);
  }

  cancelSubscription(id: string): Observable<Subscription> {
    return this.http.delete<Subscription>(`${this.apiUrl}/${id}/cancel`);
  }

  getSubscriptionsByUser(userId: string): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(`${this.apiUrl}/user/${userId}`);
  }
}