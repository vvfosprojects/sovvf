import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionepermessiComponent } from './gestione-permessi.component';

describe('GestionePermessiComponent', () => {
    let component: GestionepermessiComponent;
    let fixture: ComponentFixture<GestionepermessiComponent>;

    beforeEach(
        async(() => {
            TestBed.configureTestingModule({
                declarations: [GestionepermessiComponent]
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(GestionepermessiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
