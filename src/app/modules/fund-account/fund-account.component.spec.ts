import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundAccountComponent } from './fund-account.component';

describe('FundAccountComponent', () => {
  let component: FundAccountComponent;
  let fixture: ComponentFixture<FundAccountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FundAccountComponent]
    });
    fixture = TestBed.createComponent(FundAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
