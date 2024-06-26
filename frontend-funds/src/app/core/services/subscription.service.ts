import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subscription } from '../models/subscription.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  urlBase = environment.apiUrl;

  private apiUrl = `${this.urlBase}/api/v1/subscriptions`  ;

  constructor(private http: HttpClient) {}

  createSubscription(subscriptionData: {
    user_id: string;
    fund_id: string;
    amount: number;
    notification_type: 'sms' | 'email';
    notification_contact: string;
  }): Observable<Subscription> {
    return this.http.post<Subscription>(this.apiUrl, subscriptionData);
  }

  cancelSubscription(id: string): Observable<Subscription> {
    return this.http.put<Subscription>(`${this.apiUrl}/${id}/cancel`, {});
  }

  getSubscriptionsByUser(userId: string): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(`${this.apiUrl}/user/${userId}`);
  }
}