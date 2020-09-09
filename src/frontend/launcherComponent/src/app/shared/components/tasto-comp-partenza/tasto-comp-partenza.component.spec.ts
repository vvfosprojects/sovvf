import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TastoCompPartenzaComponent } from './tasto-comp-partenza.component';

describe('TastoCompPartenzaComponent', () => {
  let component: TastoCompPartenzaComponent;
  let fixture: ComponentFixture<TastoCompPartenzaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TastoCompPartenzaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TastoCompPartenzaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
