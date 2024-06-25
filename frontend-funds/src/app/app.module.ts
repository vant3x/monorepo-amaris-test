import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FundsListComponent } from './features/funds-list/funds-list.component';
import { FundDetailComponent } from './features/fund-detail/fund-detail.component';
import { TransactionHistoryComponent } from './features/transaction-history/transaction-history.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    FundsListComponent,
    FundDetailComponent,
    TransactionHistoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
