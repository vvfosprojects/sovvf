import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MezzoInServizioComponent } from './mezzo-in-servizio.component';

describe('MezzoInServizioComponent', () => {
  let component: MezzoInServizioComponent;
  let fixture: ComponentFixture<MezzoInServizioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MezzoInServizioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MezzoInServizioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
