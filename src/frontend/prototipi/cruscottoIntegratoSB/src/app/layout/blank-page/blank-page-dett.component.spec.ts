import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlankPageComponentDett } from './blank-page-dett.component';

describe('BlankPageComponent', () => {
    let component: BlankPageComponentDett;
    let fixture: ComponentFixture<BlankPageComponentDett>;

    beforeEach(
        async(() => {
            TestBed.configureTestingModule({
                declarations: [BlankPageComponentDett]
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(BlankPageComponentDett);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
