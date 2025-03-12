import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { restrictIfTokenGuard } from './restrict-if-token.guard';

describe('restrictIfTokenGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => restrictIfTokenGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
