import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { Fund } from 'src/app/core/models/fund.model';
import { Subscription } from 'src/app/core/models/subscription.model';
import { SubscriptionService } from 'src/app/core/services/subscription.service';
import { SubscriptionFund } from 'src/app/core/models/suscriptionFund.model';
import { MatDialog } from '@angular/material/dialog';
import { FundSubscriptionCancelDialogComponent } from './components/fund-subscription-cancel-dialog/fund-subscription-cancel-dialog.component';

@Component({
  selector: 'app-fund-detail',
  templateUrl: './fund-detail.component.html',
  styleUrls: ['./fund-detail.component.css'],
})
export class FundDetailComponent {
  @Input() fund!: SubscriptionFund;
  @Input() isSubscribed: boolean = false;
  @Input() subscription: Subscription | undefined;
  @Input() userId: string = '';
  @Output() subscriptionChanged = new EventEmitter<void>();

  showSubscriptionForm = false;
  subscriptionAmount: number = 0;
  notification_type: 'sms' | 'email' = 'sms';
  notification_contact: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private subscriptionService: SubscriptionService,
    public dialog: MatDialog
  ) {}

  openDialog() {
    const dialogRef = this.dialog.open(FundSubscriptionCancelDialogComponent, {
      width: '350px',
      data: {
        title: 'Cancelar subscripción',
        message:
          'Te gustaría cancelar la subscripción a este fondo? El valor abonado se te devolverá',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Subscirpción cancelada!');
        this.cancelSubscription();
      } else {
        console.log('No se canceló');
      }
    });
  }

  createSubscription() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.subscriptionAmount < this.fund.minimum_amount) {
      this.errorMessage = `El monto mínimo para este fondo es ${this.fund.minimum_amount}`;
      return;
    }

    const userBalance = parseFloat(
      localStorage.getItem('userBalance') || '500000'
    );
    if (this.subscriptionAmount > userBalance) {
      this.errorMessage = `No tiene saldo disponible para vincularse al fondo ${this.fund.name}`;
      return;
    }

    this.subscriptionService
      .createSubscription({
        user_id: this.userId,
        fund_id: this.fund.id,
        amount: this.subscriptionAmount,
        notification_type: this.notification_type,
        notification_contact: this.notification_contact,
      })
      .subscribe(
        (newSubscription) => {
          this.subscription = newSubscription;
          this.subscriptionChanged.emit();
          this.showSubscriptionForm = false;
          this.successMessage = 'Suscripción creada exitosamente';

          const newBalance = userBalance - this.subscriptionAmount;
          localStorage.setItem('userBalance', newBalance.toString());
        },
        (error) => {
          console.error('Error creating subscription:', error);
          this.errorMessage = 'Error al crear la suscripción';
        }
      );
  }

  cancelSubscription() {
    if (this.subscription) {
      this.subscriptionService
        .cancelSubscription(this.subscription.id)
        .subscribe(
          () => {
            const userBalance = parseFloat(
              localStorage.getItem('userBalance') || '500000'
            );
            const newBalance = userBalance + this.subscription!.amount;
            localStorage.setItem('userBalance', newBalance.toString());

            this.subscription = undefined;
            this.subscriptionChanged.emit();

            this.successMessage = 'Suscripción cancelada exitosamente';
            this.errorMessage = '';
          },
          (error) => {
            console.error('Error canceling subscription:', error);
            this.errorMessage = 'Error al cancelar la suscripción';
            this.successMessage = '';
          }
        );
    }
  }
}
