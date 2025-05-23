import { TestBed } from '@angular/core/testing';

import { AccountValuesService } from './account-values.service';

describe('AccountValuesService', () => {
  let service: AccountValuesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountValuesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
