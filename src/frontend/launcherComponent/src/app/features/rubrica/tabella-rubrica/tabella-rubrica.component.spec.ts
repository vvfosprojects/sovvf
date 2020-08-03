import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabellaRubricaComponent } from './tabella-rubrica.component';

describe('TabellaVociRubricaComponent', () => {
  let component: TabellaRubricaComponent;
  let fixture: ComponentFixture<TabellaRubricaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabellaRubricaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabellaRubricaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
