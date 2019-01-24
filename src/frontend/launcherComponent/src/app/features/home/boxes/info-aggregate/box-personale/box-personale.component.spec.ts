import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxFunzionariComponent } from './box-funzionari.component';

describe('BoxFunzionariComponent', () => {
  let component: BoxFunzionariComponent;
  let fixture: ComponentFixture<BoxFunzionariComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoxFunzionariComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxFunzionariComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
