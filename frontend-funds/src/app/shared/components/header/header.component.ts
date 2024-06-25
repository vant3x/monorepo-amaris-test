import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  menuItems = [
    { path: '/fondos', label: 'Fondos' },
    { path: '/transacciones', label: 'Transacciones' },
    { path: '/perfil', label: 'Mi Perfil' }
  ];
}
