import {Injectable} from '@angular/core';
import {Marker} from '../model/marker.model';

@Injectable({
  providedIn: 'root'
})

export class MapsService {
  lat: number = 42.2417149;
  lng: number = 12.3346679;
  zoom: number = 6;
  markers: Marker[];

  constructor() { }

  getLat(){
    return this.lat;
  }
  
  getLng(){
    return this.lng;
  }

  getZoom(){
    return this.zoom;
  }
}
