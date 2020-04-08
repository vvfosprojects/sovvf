import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RichiesteAssistenzaComponent } from './richieste-assistenza.component';

describe('BlankPageComponent', () => {
    let component: RichiesteAssistenzaComponent;
    let fixture: ComponentFixture<RichiesteAssistenzaComponent>;

    beforeEach(
        async(() => {
            TestBed.configureTestingModule({
                declarations: [RichiesteAssistenzaComponent]
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(RichiesteAssistenzaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
