import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrenotazioneProgressBarComponent } from './prenotazione-progress-bar.component';

describe('PrenotazioneProgressBarComponent', () => {
  let component: PrenotazioneProgressBarComponent;
  let fixture: ComponentFixture<PrenotazioneProgressBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrenotazioneProgressBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrenotazioneProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
