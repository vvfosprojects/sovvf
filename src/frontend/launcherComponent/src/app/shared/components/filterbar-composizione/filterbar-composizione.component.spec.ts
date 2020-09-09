import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterbarComposizioneComponent } from './filterbar-composizione.component';

describe('ComposizioneFilterbarComponent', () => {
  let component: FilterbarComposizioneComponent;
  let fixture: ComponentFixture<FilterbarComposizioneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterbarComposizioneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterbarComposizioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
