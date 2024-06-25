import { Component, Inject } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-fund-subscription-cancel-dialog',
  templateUrl: './fund-subscription-cancel-dialog.component.html',
  styleUrls: ['./fund-subscription-cancel-dialog.component.css']
})
export class FundSubscriptionCancelDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<FundSubscriptionCancelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string  }
  ) {}

  confirmCancelSubscription() {
    this.dialogRef.close(true);
  }
}
