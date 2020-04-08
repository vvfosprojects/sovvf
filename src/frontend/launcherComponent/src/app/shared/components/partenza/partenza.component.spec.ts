import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartenzaComponent } from './partenza.component';

describe('PartenzaComponent', () => {
  let component: PartenzaComponent;
  let fixture: ComponentFixture<PartenzaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartenzaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartenzaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
