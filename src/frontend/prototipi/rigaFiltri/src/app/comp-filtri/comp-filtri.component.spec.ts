import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompFiltriComponent } from './comp-filtri.component';

describe('CompFiltriComponent', () => {
  let component: CompFiltriComponent;
  let fixture: ComponentFixture<CompFiltriComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompFiltriComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompFiltriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
