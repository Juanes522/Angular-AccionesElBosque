import { TestBed } from '@angular/core/testing';

import { TradingServiceService } from './trading-service.service';

describe('TradingServiceService', () => {
  let service: TradingServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TradingServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
