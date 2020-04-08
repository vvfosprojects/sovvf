import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CompetenzaComponent} from './competenza.component';

describe('CompetenzaComponent', () => {
    let component: CompetenzaComponent;
    let fixture: ComponentFixture<CompetenzaComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CompetenzaComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CompetenzaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
