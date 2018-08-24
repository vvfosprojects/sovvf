import { Component, OnInit } from '@angular/core';
import {MapsService} from '../maps-service/maps-service.service';
import { Marker } from '../model/marker.model';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {
  lat: number;
  lng: number;
  zoom: number;
  markers: Marker[];

  constructor(private mapService:MapsService) { }

  ngOnInit() {
    this.initializeMap();
    this.markers = this.mapService.markers;
  }

  initializeMap(){
    this.lat = this.mapService.getLat();
    this.lng = this.mapService.getLng();
    this.zoom = this.mapService.getZoom();
  }


}
