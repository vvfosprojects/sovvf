import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltriRichiesteComponent } from './filtri-richieste.component';

describe('FiltriRichiesteComponent', () => {
  let component: FiltriRichiesteComponent;
  let fixture: ComponentFixture<FiltriRichiesteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltriRichiesteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltriRichiesteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
