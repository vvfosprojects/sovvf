import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartografiaInterventiComponent } from './cartografia-interventi.component';

describe('CartografiaInterventiComponent', () => {
  let component: CartografiaInterventiComponent;
  let fixture: ComponentFixture<CartografiaInterventiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartografiaInterventiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartografiaInterventiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
