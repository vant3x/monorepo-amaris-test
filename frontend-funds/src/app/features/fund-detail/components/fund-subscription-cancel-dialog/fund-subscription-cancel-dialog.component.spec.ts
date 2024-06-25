import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundSubscriptionCancelDialogComponent } from './fund-subscription-cancel-dialog.component';

describe('FundSubscriptionCancelDialogComponent', () => {
  let component: FundSubscriptionCancelDialogComponent;
  let fixture: ComponentFixture<FundSubscriptionCancelDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FundSubscriptionCancelDialogComponent]
    });
    fixture = TestBed.createComponent(FundSubscriptionCancelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
