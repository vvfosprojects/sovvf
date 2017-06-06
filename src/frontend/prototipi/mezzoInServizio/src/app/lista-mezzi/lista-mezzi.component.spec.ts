import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaMezziComponent } from './lista-mezzi.component';

describe('ListaMezziComponent', () => {
  let component: ListaMezziComponent;
  let fixture: ComponentFixture<ListaMezziComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaMezziComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaMezziComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
