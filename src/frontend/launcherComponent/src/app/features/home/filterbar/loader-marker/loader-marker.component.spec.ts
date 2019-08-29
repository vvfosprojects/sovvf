import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderMarkerComponent } from './loader-marker.component';

describe('LoaderMarkerComponent', () => {
  let component: LoaderMarkerComponent;
  let fixture: ComponentFixture<LoaderMarkerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoaderMarkerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaderMarkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
