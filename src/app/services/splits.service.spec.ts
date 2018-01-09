import { TestBed, inject } from '@angular/core/testing';

import { SplitsService } from './splits.service';

describe('SplitsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SplitsService]
    });
  });

  it('should be created', inject([SplitsService], (service: SplitsService) => {
    expect(service).toBeTruthy();
  }));
});
