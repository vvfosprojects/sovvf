import { Component, OnInit } from '@angular/core';
import {MapsService} from '../maps-service/maps-service.service';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {
  lat: number = 42.2417149;
  lng: number = 12.3346679;
  zoom: number = 6;

  constructor(private mapService:MapsService) { }

  ngOnInit() {
  }

}
