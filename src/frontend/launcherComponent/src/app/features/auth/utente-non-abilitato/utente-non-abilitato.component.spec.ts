import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UtenteNonAbilitatoComponent } from './utente-non-abilitato.component';

describe('UtenteNonAbilitatoComponent', () => {
  let component: UtenteNonAbilitatoComponent;
  let fixture: ComponentFixture<UtenteNonAbilitatoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UtenteNonAbilitatoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UtenteNonAbilitatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
