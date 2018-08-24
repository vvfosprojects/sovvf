import { Component, OnInit } from '@angular/core';
import { SintesiRichiesteService } from '../sintesi-richieste-service/sintesi-richieste.service';
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

  constructor(private sintesiRichiesteService: SintesiRichiesteService, private mapsService:MapsService) { }

  ngOnInit() {
    this.initializeMap();

    this.sintesiRichiesteService.getSintesiRichieste().subscribe(r => {
        r.forEach(richiesta => {
          this.markers = richiesta.descrizioneLocalita.coordinate;
          console.log(this.markers);
        });
    });
  }

  initializeMap(){
    this.lat = this.mapsService.getLat();
    this.lng = this.mapsService.getLng();
    this.zoom = this.mapsService.getZoom();
  }


}
