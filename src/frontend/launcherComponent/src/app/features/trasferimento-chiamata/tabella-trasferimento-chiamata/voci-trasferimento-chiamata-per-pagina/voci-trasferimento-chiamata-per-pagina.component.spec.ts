import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VociTrasferimentoChiamataPerPaginaComponent } from './voci-trasferimento-chiamata-per-pagina.component';

describe('VociTrasferimentoChiamataPerPaginaComponent', () => {
  let component: VociTrasferimentoChiamataPerPaginaComponent;
  let fixture: ComponentFixture<VociTrasferimentoChiamataPerPaginaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VociTrasferimentoChiamataPerPaginaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VociTrasferimentoChiamataPerPaginaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
