import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartialLoaderComponent } from './partial-loader.component';

describe('PartialLoaderComponent', () => {
  let component: PartialLoaderComponent;
  let fixture: ComponentFixture<PartialLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartialLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartialLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
