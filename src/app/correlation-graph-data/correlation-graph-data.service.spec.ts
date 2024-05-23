import { TestBed } from '@angular/core/testing';

import { CorrelationGraphDataService } from './correlation-graph-data.service';

describe('CorrelationGraphDataService', () => {
  let service: CorrelationGraphDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CorrelationGraphDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
