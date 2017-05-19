import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MezzoinservizioComponent } from './mezzoinservizio.component';

describe('MezzoinservizioComponent', () => {
  let component: MezzoinservizioComponent;
  let fixture: ComponentFixture<MezzoinservizioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MezzoinservizioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MezzoinservizioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
