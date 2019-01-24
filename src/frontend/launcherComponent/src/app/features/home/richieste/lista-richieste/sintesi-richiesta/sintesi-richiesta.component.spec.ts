import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SintesiRichiestaComponent} from './sintesi-richiesta.component';

describe('SintesiRichiestaComponent', () => {
    let component: SintesiRichiestaComponent;
    let fixture: ComponentFixture<SintesiRichiestaComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SintesiRichiestaComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SintesiRichiestaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
