import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxNuovaPartenzaComponent } from './box-nuova-partenza.component';

describe('PreaccoppiatoComponent', () => {
  let component: BoxNuovaPartenzaComponent;
  let fixture: ComponentFixture<BoxNuovaPartenzaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoxNuovaPartenzaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxNuovaPartenzaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
