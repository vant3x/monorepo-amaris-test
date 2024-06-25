import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FundDetailComponent } from './features/fund-detail/fund-detail.component';
import { FundsListComponent } from './features/funds-list/funds-list.component';
import { TransactionHistoryComponent } from './features/transaction-history/transaction-history.component';

const routes: Routes = [
  { path: '', redirectTo: '/fondos', pathMatch: 'full' },
  { path: 'fondos', component: FundsListComponent },
  { path: 'fondos/:id', component: FundDetailComponent },
  { path: 'transactions', component: TransactionHistoryComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
