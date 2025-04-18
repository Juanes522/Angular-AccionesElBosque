import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderHistoryComponentComponent } from './order-history-component.component';

describe('OrderHistoryComponentComponent', () => {
  let component: OrderHistoryComponentComponent;
  let fixture: ComponentFixture<OrderHistoryComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderHistoryComponentComponent]
    });
    fixture = TestBed.createComponent(OrderHistoryComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
