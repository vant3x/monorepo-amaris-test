import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class UserIdService {

  getUserId(): string {
    let userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem('userId', userId); 
      localStorage.setItem('userBalance', '500000');
    }
    return userId;
  }
}
