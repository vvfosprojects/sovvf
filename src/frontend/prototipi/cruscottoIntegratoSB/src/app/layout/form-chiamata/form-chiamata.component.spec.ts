import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormChiamataComponent } from './form-chiamata.component';

describe('BlankPageComponent', () => {
    let component: FormChiamataComponent;
    let fixture: ComponentFixture<FormChiamataComponent>;

    beforeEach(
        async(() => {
            TestBed.configureTestingModule({
                declarations: [FormChiamataComponent]
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(FormChiamataComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
