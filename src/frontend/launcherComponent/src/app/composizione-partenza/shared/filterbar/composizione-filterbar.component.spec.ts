import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComposizioneFilterbarComponent } from './composizione-filterbar.component';

describe('ComposizioneFilterbarComponent', () => {
  let component: ComposizioneFilterbarComponent;
  let fixture: ComponentFixture<ComposizioneFilterbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComposizioneFilterbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComposizioneFilterbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
