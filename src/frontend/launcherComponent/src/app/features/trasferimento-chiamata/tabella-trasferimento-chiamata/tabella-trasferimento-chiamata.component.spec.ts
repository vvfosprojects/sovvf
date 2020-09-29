import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabellaTrasferimentoChiamataComponent } from './tabella-trasferimento-chiamata.component';

describe('TabellaTrasferimentoChiamataComponent', () => {
  let component: TabellaTrasferimentoChiamataComponent;
  let fixture: ComponentFixture<TabellaTrasferimentoChiamataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabellaTrasferimentoChiamataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabellaTrasferimentoChiamataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
