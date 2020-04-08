import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MezziComponent } from './mezzi.component';

describe('BlankPageComponent', () => {
    let component: MezziComponent;
    let fixture: ComponentFixture<MezziComponent>;

    beforeEach(
        async(() => {
            TestBed.configureTestingModule({
                declarations: [MezziComponent]
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(MezziComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
