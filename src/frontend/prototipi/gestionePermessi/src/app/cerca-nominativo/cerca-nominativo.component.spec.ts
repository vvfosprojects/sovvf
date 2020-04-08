import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CercaNominativoComponent } from './cerca-nominativo.component';

describe('CercaNominativoComponent', () => {
  let component: CercaNominativoComponent;
  let fixture: ComponentFixture<CercaNominativoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CercaNominativoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CercaNominativoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
