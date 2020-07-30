import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabellaVociRubricaComponent } from './tabella-voci-rubrica.component';

describe('TabellaVociRubricaComponent', () => {
  let component: TabellaVociRubricaComponent;
  let fixture: ComponentFixture<TabellaVociRubricaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabellaVociRubricaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabellaVociRubricaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
