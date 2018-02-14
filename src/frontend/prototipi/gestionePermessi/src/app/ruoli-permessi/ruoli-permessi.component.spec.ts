import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RuoliPermessiComponent } from './ruoli-permessi.component';

describe('RuoliPermessiComponent', () => {
  let component: RuoliPermessiComponent;
  let fixture: ComponentFixture<RuoliPermessiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RuoliPermessiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuoliPermessiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
