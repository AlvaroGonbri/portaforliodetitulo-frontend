import { TestBed } from '@angular/core/testing';

import { GTHService } from './gth.service';

describe('GTHService', () => {
  let service: GTHService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GTHService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
