import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedeContattoComponent } from './schede-contatto.component';

describe('SchedeContattoComponent', () => {
  let component: SchedeContattoComponent;
  let fixture: ComponentFixture<SchedeContattoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedeContattoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedeContattoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
