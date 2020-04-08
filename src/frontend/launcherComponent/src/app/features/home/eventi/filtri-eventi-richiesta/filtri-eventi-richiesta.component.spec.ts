import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltriEventiRichiestaComponent } from './filtri-eventi-richiesta.component';

describe('FiltriEventiRichiestaComponent', () => {
  let component: FiltriEventiRichiestaComponent;
  let fixture: ComponentFixture<FiltriEventiRichiestaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltriEventiRichiestaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltriEventiRichiestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
