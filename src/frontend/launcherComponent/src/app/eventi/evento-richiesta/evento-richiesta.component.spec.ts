import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventoRichiestaComponent } from './evento-richiesta.component';

describe('EventoRichiestaComponent', () => {
  let component: EventoRichiestaComponent;
  let fixture: ComponentFixture<EventoRichiestaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventoRichiestaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventoRichiestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
