import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { GetInitCentroMappa } from '../../../store/actions/maps/centro-mappa.actions';

@Component({
  selector: 'app-centro-button',
  templateUrl: './centro-button.component.html',
  styleUrls: ['./centro-button.component.css']
})
export class CentroButtonComponent implements OnInit {

  constructor(private store: Store) { }

  ngOnInit() {
  }

  centra() {
    this.store.dispatch(new GetInitCentroMappa());
  }

}
