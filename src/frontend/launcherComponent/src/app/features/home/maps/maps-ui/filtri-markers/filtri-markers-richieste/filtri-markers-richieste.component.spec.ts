import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltriMarkersRichiesteComponent } from './filtri-markers-richieste.component';

describe('FiltriMarkersRichiesteComponent', () => {
  let component: FiltriMarkersRichiesteComponent;
  let fixture: ComponentFixture<FiltriMarkersRichiesteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltriMarkersRichiesteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltriMarkersRichiesteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
