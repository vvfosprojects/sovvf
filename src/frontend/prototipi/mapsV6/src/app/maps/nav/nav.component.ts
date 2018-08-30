import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { RichiestaMarker } from '../maps-model/richiesta-marker.model';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  @Output() randomMarker = new EventEmitter();
  @Output() removeMarker = new EventEmitter();
  newMarker: RichiestaMarker;
  constructor() { }

  ngOnInit() {
  }

  addRandomMarker() {
    const lat = Math.floor(Math.random() * 10000000) * 0.0000001 + 42;
    const long = Math.floor(Math.random() * 10000000) * 0.0000001 + 12;
    this.newMarker = new RichiestaMarker(
      1, { 'indirizzo': 'Via Cavour, 5', 'coordinate': [lat, long] }, 1, 'Marker aggiunto Random', false, 3);
    this.randomMarker.emit(this.newMarker);
    // console.log(this.newMarker);
  }

  removeLastMarker() {
    this.removeMarker.emit();
  }
}
