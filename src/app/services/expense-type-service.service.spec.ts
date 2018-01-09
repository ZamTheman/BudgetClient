import { TestBed, inject } from '@angular/core/testing';

import { ExpenseTypeServiceService } from './expense-type-service.service';

describe('ExpenseTypeServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExpenseTypeServiceService]
    });
  });

  it('should be created', inject([ExpenseTypeServiceService], (service: ExpenseTypeServiceService) => {
    expect(service).toBeTruthy();
  }));
});
