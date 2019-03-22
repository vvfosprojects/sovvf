import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificaRichiestaComponent } from './modifica-richiesta.component';

describe('ModificaRichiestaComponent', () => {
  let component: ModificaRichiestaComponent;
  let fixture: ComponentFixture<ModificaRichiestaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModificaRichiestaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificaRichiestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
