import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BottoneNuovaVersioneComponent } from './bottone-nuova-versione.component';

describe('BottoneNuovaVersioneComponent', () => {
  let component: BottoneNuovaVersioneComponent;
  let fixture: ComponentFixture<BottoneNuovaVersioneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BottoneNuovaVersioneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BottoneNuovaVersioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
