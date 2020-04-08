import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComposizioneAvanzataComponent } from './composizione-avanzata.component';

describe('SlowerComponent', () => {
  let component: ComposizioneAvanzataComponent;
  let fixture: ComponentFixture<ComposizioneAvanzataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComposizioneAvanzataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComposizioneAvanzataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
