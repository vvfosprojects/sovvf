import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemInterventoComponent } from './item-intervento.component';

describe('ItemInterventoComponent', () => {
  let component: ItemInterventoComponent;
  let fixture: ComponentFixture<ItemInterventoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemInterventoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemInterventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
