import {inject, TestBed} from '@angular/core/testing';

import {PrescenceService} from './prescence.service';

describe('PrescenceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrescenceService]
    });
  });

  it('should be created', inject([PrescenceService], (service: PrescenceService) => {
    expect(service).toBeTruthy();
  }));
});
