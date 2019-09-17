import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TastiTelefonataGroupComponent } from './tasti-telefonata-group.component';

describe('TastoChiamataGroupComponent', () => {
  let component: TastiTelefonataGroupComponent;
  let fixture: ComponentFixture<TastiTelefonataGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TastiTelefonataGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TastiTelefonataGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
