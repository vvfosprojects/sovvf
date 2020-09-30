import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpostazioniComponent } from './impostazioni.component';

describe('ImpostazioniComponent', () => {
  let component: ImpostazioniComponent;
  let fixture: ComponentFixture<ImpostazioniComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImpostazioniComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpostazioniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
