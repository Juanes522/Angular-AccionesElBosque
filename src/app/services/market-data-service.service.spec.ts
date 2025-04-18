import { TestBed } from '@angular/core/testing';

import { MarketDataServiceService } from './market-data-service.service';

describe('MarketDataServiceService', () => {
  let service: MarketDataServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarketDataServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
