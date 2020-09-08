import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MezzoComposizioneComponent } from './mezzo-composizione.component';

describe('MezzoComponent', () => {
  let component: MezzoComposizioneComponent;
  let fixture: ComponentFixture<MezzoComposizioneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MezzoComposizioneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MezzoComposizioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
