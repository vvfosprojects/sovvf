import { Component, OnInit } from '@angular/core';
import {MapsService} from '../maps-service/maps-service.service';
import { Marker } from '../model/marker.model';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {
  lat: number = 42.2417149;
  lng: number = 12.3346679;
  zoom: number = 6;
  markers: Marker[];

  constructor(private mapsService:MapsService) { }

  ngOnInit() {
    this.markers = this.mapsService.setMarkers();
  }
}
