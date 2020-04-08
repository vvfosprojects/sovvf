import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RisultatiPaginazioneComponent } from './risultati-paginazione.component';

describe('RisultatiPaginazioneComponent', () => {
  let component: RisultatiPaginazioneComponent;
  let fixture: ComponentFixture<RisultatiPaginazioneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RisultatiPaginazioneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RisultatiPaginazioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
