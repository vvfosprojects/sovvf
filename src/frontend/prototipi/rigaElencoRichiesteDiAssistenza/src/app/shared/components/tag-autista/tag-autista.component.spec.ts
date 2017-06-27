/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TagAutistaComponent } from './tag-autista.component';

describe('TagAutistaComponent', () => {
  let component: TagAutistaComponent;
  let fixture: ComponentFixture<TagAutistaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagAutistaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagAutistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
