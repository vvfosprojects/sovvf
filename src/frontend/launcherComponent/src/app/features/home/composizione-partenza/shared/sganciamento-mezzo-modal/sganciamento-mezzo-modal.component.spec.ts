import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SganciamentoMezzoModalComponent } from './sganciamento-mezzo-modal.component';

describe('SganciamentoMezzoModalComponent', () => {
  let component: SganciamentoMezzoModalComponent;
  let fixture: ComponentFixture<SganciamentoMezzoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SganciamentoMezzoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SganciamentoMezzoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
