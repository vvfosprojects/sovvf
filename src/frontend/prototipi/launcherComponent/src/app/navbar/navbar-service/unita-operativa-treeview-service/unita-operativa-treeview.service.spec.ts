import { TestBed, inject } from '@angular/core/testing';

import { UnitaOperativaTreeviewService } from './unita-operativa-treeview.service';

describe('UnitaOperativaTreeviewService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnitaOperativaTreeviewService]
    });
  });

  it('should be created', inject([UnitaOperativaTreeviewService], (service: UnitaOperativaTreeviewService) => {
    expect(service).toBeTruthy();
  }));
});
