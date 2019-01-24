import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RicercaRichiesteComponent } from './ricerca-richieste.component';

describe('RicercaRichiesteComponent', () => {
  let component: RicercaRichiesteComponent;
  let fixture: ComponentFixture<RicercaRichiesteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RicercaRichiesteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RicercaRichiesteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
