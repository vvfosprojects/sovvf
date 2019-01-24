import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitaOperativaTreeviewComponent } from './unita-operativa-treeview.component';

describe('UnitaOperativaTreeviewComponent', () => {
  let component: UnitaOperativaTreeviewComponent;
  let fixture: ComponentFixture<UnitaOperativaTreeviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitaOperativaTreeviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitaOperativaTreeviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
