import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxAnteprimaPartenzaComponent } from './box-anteprima-partenza.component';

describe('BoxAnteprimaPartenzaComponent', () => {
  let component: BoxAnteprimaPartenzaComponent;
  let fixture: ComponentFixture<BoxAnteprimaPartenzaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoxAnteprimaPartenzaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxAnteprimaPartenzaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
