import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapsFiltroComponent } from './maps-filtro.component';

describe('MapsFiltroComponent', () => {
  let component: MapsFiltroComponent;
  let fixture: ComponentFixture<MapsFiltroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapsFiltroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapsFiltroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
