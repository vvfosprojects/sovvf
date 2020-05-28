import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignalROfflineComponent } from './signal-r-offline.component';

describe('SignalROfflineComponent', () => {
  let component: SignalROfflineComponent;
  let fixture: ComponentFixture<SignalROfflineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignalROfflineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignalROfflineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
