import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaSquadrePartenzaComponent } from './lista-squadre-partenza.component';

describe('ListaSquadrePartenzaComponent', () => {
  let component: ListaSquadrePartenzaComponent;
  let fixture: ComponentFixture<ListaSquadrePartenzaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaSquadrePartenzaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaSquadrePartenzaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
