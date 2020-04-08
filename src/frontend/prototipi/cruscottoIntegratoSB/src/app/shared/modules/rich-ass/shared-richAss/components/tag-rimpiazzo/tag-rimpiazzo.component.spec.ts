/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TagRimpiazzoComponent } from './tag-rimpiazzo.component';

describe('TagRimpiazzoComponent', () => {
  let component: TagRimpiazzoComponent;
  let fixture: ComponentFixture<TagRimpiazzoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagRimpiazzoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagRimpiazzoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
