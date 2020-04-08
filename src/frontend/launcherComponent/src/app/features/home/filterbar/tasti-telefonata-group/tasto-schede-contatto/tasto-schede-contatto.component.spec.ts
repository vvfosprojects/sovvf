import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TastoSchedeContattoComponent } from './tasto-schede-contatto.component';

describe('TastoSchedeContattoComponent', () => {
  let component: TastoSchedeContattoComponent;
  let fixture: ComponentFixture<TastoSchedeContattoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TastoSchedeContattoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TastoSchedeContattoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
