import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

import { HeaderComponent } from './components/header/header.component';
//import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';

import { CurrencyFormatPipe } from './pipes/currency-format.pipe';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    HeaderComponent,
    CurrencyFormatPipe,
  ],
  imports: [
    CommonModule,
    RouterModule,
     MatIconModule, 
    MatToolbarModule,
    MatDialogModule,
    MatButtonModule,
  ],
  exports: [
    HeaderComponent,
    CurrencyFormatPipe,
    MatToolbarModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
  ]
})
export class SharedModule { }