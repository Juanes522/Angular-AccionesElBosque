import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionComponentComponent } from './subscription-component.component';

describe('SubscriptionComponentComponent', () => {
  let component: SubscriptionComponentComponent;
  let fixture: ComponentFixture<SubscriptionComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubscriptionComponentComponent]
    });
    fixture = TestBed.createComponent(SubscriptionComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
