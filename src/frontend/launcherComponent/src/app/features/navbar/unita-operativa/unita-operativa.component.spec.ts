import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitaOperativaComponent } from './unita-operativa.component';

describe('UnitaOperativaComponent', () => {
  let component: UnitaOperativaComponent;
  let fixture: ComponentFixture<UnitaOperativaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitaOperativaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitaOperativaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
