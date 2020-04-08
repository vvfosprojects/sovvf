import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComposizioneButtonsComponent } from './composizione-buttons.component';

describe('ComposizioneButtonsComponent', () => {
  let component: ComposizioneButtonsComponent;
  let fixture: ComponentFixture<ComposizioneButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComposizioneButtonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComposizioneButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
