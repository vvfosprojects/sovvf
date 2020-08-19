import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectElementiPerPaginaComponent } from './select-elementi-per-pagina.component';

describe('SelectElementiPerPaginaComponent', () => {
  let component: SelectElementiPerPaginaComponent;
  let fixture: ComponentFixture<SelectElementiPerPaginaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectElementiPerPaginaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectElementiPerPaginaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
