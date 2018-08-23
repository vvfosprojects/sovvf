/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';

import {TagCapopartenzaComponent} from './tag-capopartenza.component';

describe('TagCapopartenzaComponent', () => {
    let component: TagCapopartenzaComponent;
    let fixture: ComponentFixture<TagCapopartenzaComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TagCapopartenzaComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TagCapopartenzaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
