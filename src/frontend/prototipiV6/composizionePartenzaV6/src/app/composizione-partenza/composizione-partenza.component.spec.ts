import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComposizionePartenzaComponent } from './composizione-partenza.component';

describe('ComposizionePartenzaComponent', () => {
  let component: ComposizionePartenzaComponent;
  let fixture: ComponentFixture<ComposizionePartenzaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComposizionePartenzaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComposizionePartenzaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
