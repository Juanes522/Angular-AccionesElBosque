import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketDataComponentComponent } from './market-data-component.component';

describe('MarketDataComponentComponent', () => {
  let component: MarketDataComponentComponent;
  let fixture: ComponentFixture<MarketDataComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MarketDataComponentComponent]
    });
    fixture = TestBed.createComponent(MarketDataComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
