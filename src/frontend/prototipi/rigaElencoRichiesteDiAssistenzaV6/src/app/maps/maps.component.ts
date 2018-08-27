import { Component, OnInit } from '@angular/core';
import { MapsServiceFake } from '../maps-service/maps-service.service.fake';
import { RichiestaMarker } from '../model/richiesta-marker.model';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {
  lat: number = 42.2417149;
  lng: number = 12.3346679;
  zoom: number = 6;
  richiesteMarkers: RichiestaMarker[];

  constructor(private mapsServiceFake:MapsServiceFake) { }

  ngOnInit() {
    this.richiesteMarkers = this.mapsServiceFake.getData();
    console.log(this.richiesteMarkers);
  }
}
