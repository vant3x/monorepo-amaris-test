import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundDetailComponent } from './fund-detail.component';

describe('FundDetailComponent', () => {
  let component: FundDetailComponent;
  let fixture: ComponentFixture<FundDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FundDetailComponent]
    });
    fixture = TestBed.createComponent(FundDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
