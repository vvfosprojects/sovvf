import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltriSchedeContattoComponent } from './filtri-schede-contatto.component';

describe('FiltriSchedeContattoComponent', () => {
  let component: FiltriSchedeContattoComponent;
  let fixture: ComponentFixture<FiltriSchedeContattoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltriSchedeContattoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltriSchedeContattoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
