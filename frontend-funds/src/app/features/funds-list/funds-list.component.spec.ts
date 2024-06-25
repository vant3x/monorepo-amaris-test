import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundsListComponent } from './funds-list.component';

describe('FundsListComponent', () => {
  let component: FundsListComponent;
  let fixture: ComponentFixture<FundsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FundsListComponent]
    });
    fixture = TestBed.createComponent(FundsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
