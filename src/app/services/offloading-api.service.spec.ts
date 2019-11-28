import { TestBed } from '@angular/core/testing';

import { OffloadingApiService } from './offloading-api.service';

describe('OffloadingApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OffloadingApiService = TestBed.get(OffloadingApiService);
    expect(service).toBeTruthy();
  });
});
