import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RicercaRubricaComponent } from './ricerca-rubrica.component';

describe('RicercaRubricaComponent', () => {
  let component: RicercaRubricaComponent;
  let fixture: ComponentFixture<RicercaRubricaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RicercaRubricaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RicercaRubricaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
