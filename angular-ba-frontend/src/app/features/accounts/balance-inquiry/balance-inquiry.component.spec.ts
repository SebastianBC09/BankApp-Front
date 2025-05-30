import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceInquiryComponent } from './balance-inquiry.component';

describe('BalanceInquiryComponent', () => {
  let component: BalanceInquiryComponent;
  let fixture: ComponentFixture<BalanceInquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BalanceInquiryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BalanceInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
