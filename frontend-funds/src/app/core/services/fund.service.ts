import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fund } from '../models/fund.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FundService {
  urlBase = environment.apiUrl;
  private apiUrl = `${this.urlBase}/api/v1/funds`;

  constructor(private http: HttpClient) {}

  getAllFunds(): Observable<Fund[]> {
    return this.http.get<Fund[]>(this.apiUrl);
  }

  getFundById(id: string): Observable<Fund> {
    return this.http.get<Fund>(`${this.apiUrl}/${id}`);
  }
}