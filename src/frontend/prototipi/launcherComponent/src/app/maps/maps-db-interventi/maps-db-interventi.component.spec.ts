import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapsDbInterventiComponent } from './maps-db-interventi.component';

describe('MapsDbInterventiComponent', () => {
  let component: MapsDbInterventiComponent;
  let fixture: ComponentFixture<MapsDbInterventiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapsDbInterventiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapsDbInterventiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
