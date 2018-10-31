import {TestBed, inject} from '@angular/core/testing';

import {SintesiRichiesteService} from './lista-richieste.service';

describe('SintesiRichiesteService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SintesiRichiesteService]
        });
    });

    it('should be created', inject([SintesiRichiesteService], (service: SintesiRichiesteService) => {
        expect(service).toBeTruthy();
    }));
});
