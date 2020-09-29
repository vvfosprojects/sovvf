import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SquadraComposizioneComponent } from './squadra-composizione.component';

describe('SquadraComposizioneComponent', () => {
  let component: SquadraComposizioneComponent;
  let fixture: ComponentFixture<SquadraComposizioneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SquadraComposizioneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SquadraComposizioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
