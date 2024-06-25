  import { Component, Input, Output, EventEmitter } from '@angular/core';
  import { CurrencyPipe } from '@angular/common';


  import { Fund } from 'src/app/core/models/fund.model';
  import { Subscription } from 'src/app/core/models/subscription.model';
  import { SubscriptionService } from 'src/app/core/services/subscription.service';

  @Component({
    selector: 'app-fund-detail',
    templateUrl: './fund-detail.component.html',
    styleUrls: ['./fund-detail.component.css']
  })
  export class FundDetailComponent {
    @Input() fund!: Fund;
    @Input() subscription: Subscription | undefined;
    @Input() userId: string = '';
    @Output() subscriptionChanged = new EventEmitter<void>();

    showSubscriptionForm = false;
    subscriptionAmount: number = 0;
    notificationType: 'sms' | 'email' = 'sms';
    notificationContact: string = '';
    errorMessage: string = '';
    successMessage: string = '';
  
    constructor(private subscriptionService: SubscriptionService) {}

    createSubscription() {
      this.errorMessage = '';
      this.successMessage = '';
  
        if (this.subscriptionAmount < this.fund.minimumAmount) {
          this.errorMessage = `El monto mínimo para este fondo es ${this.fund.minimumAmount}`;
          return;
        }

      const userBalance = parseFloat(localStorage.getItem('userBalance') || '500000');
      if (this.subscriptionAmount > userBalance) {
        this.errorMessage = `No tiene saldo disponible para vincularse al fondo ${this.fund.name}`;
        return;
      }

      this.subscriptionService.createSubscription({
        userId: this.userId,
        fundId: this.fund.id,
        amount: this.subscriptionAmount,
        notificationType: this.notificationType,
        notificationContact: this.notificationContact
      }).subscribe(
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
          console.error('Error creating subscription:', error);
           this.errorMessage = 'Error al crear la suscripción';
        }
      );
    }

    cancelSubscription() {
      if (this.subscription) {
        this.subscriptionService.cancelSubscription(this.subscription.id).subscribe(
          () => {

            const userBalance = parseFloat(localStorage.getItem('userBalance') || '500000');
            const newBalance = userBalance + this.subscription!.amount;
            localStorage.setItem('userBalance', newBalance.toString());

          
            this.subscription = undefined;
            this.subscriptionChanged.emit();
          },
          (error) => {
            console.error('Error canceling subscription:', error);

          }
        );
      }
    }
  }