import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiamataComponent } from './chiamata.component';

describe('ChiamataComponent', () => {
  let component: ChiamataComponent;
  let fixture: ComponentFixture<ChiamataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChiamataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiamataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
