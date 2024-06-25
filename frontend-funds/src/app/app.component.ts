import { Component, OnInit } from '@angular/core';
import { UserIdService } from './core/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {
  title = 'BTG Plataforma de Fondos';
  userId: string = '';

  constructor(private userIdService: UserIdService) {}

  ngOnInit() {
    this.userId = this.userIdService.getUserId();
    console.log("El ID de usuario es:", this.userId); 
  }
}
