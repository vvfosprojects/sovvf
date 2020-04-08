import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SquadraInServizioComponent } from './squadra-in-servizio.component';

describe('SquadraInServizioComponent', () => {
  let component: SquadraInServizioComponent;
  let fixture: ComponentFixture<SquadraInServizioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SquadraInServizioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SquadraInServizioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
