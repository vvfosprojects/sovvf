import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxSquadreComponent } from './box-squadre.component';

describe('BoxSquadreComponent', () => {
  let component: BoxSquadreComponent;
  let fixture: ComponentFixture<BoxSquadreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoxSquadreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxSquadreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
