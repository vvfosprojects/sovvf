import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaEventiRichiestaComponent } from './lista-eventi-richiesta.component';

describe('ListaEventiRichiestaComponent', () => {
  let component: ListaEventiRichiestaComponent;
  let fixture: ComponentFixture<ListaEventiRichiestaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaEventiRichiestaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaEventiRichiestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
