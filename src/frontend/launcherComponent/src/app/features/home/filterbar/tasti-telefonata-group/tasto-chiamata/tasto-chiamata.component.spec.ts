import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TastoChiamataComponent } from './tasto-chiamata.component';

describe('TastoChiamataComponent', () => {
  let component: TastoChiamataComponent;
  let fixture: ComponentFixture<TastoChiamataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TastoChiamataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TastoChiamataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
