import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ComponenteComponent} from './componente.component';
import {TruncatePipe} from '../shared/pipes/truncate.pipe';

describe('ComponenteComponent', () => {
    let comp: ComponenteComponent;
    let fixture: ComponentFixture<ComponenteComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ComponenteComponent],
            imports: [
                TruncatePipe
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(ComponenteComponent);
            comp = fixture.componentInstance;
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ComponenteComponent);
        comp = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(comp).toBeTruthy();
    });
});
