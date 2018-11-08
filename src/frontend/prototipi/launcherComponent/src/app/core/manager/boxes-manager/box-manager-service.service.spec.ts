import {TestBed, inject} from '@angular/core/testing';

import {BoxManagerService} from './box-manager-service.service';

describe('MapManagerService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [BoxManagerService]
        });
    });

    it('should be created', inject([BoxManagerService], (service: BoxManagerService) => {
        expect(service).toBeTruthy();
    }));
});
