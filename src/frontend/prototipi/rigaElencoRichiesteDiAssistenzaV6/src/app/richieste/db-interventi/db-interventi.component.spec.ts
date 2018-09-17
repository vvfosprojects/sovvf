import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DbInterventiComponent } from './db-interventi.component';

describe('ListaRichiesteComponent', () => {
  let component: DbInterventiComponent;
  let fixture: ComponentFixture<DbInterventiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DbInterventiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbInterventiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
