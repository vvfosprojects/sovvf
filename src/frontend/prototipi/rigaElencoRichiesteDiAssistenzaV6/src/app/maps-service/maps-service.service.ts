import {Injectable} from '@angular/core';
import { SintesiRichiesteService } from 'src/app/sintesi-richieste-service/sintesi-richieste.service';
import { Marker } from '../model/marker.model';

@Injectable({
  providedIn: 'root'
})

export class MapsService {
  markers: Marker[] = [];

  constructor(private sintesiRichiesteService: SintesiRichiesteService) { }

  setMarkers(){
    this.sintesiRichiesteService.getSintesiRichieste().subscribe(richieste =>{
      richieste.forEach(r => {
        this.markers.push(new Marker(r.descrizioneLocalita.coordinate[0],r.descrizioneLocalita.coordinate[1]))
      });
    })
    return this.markers;
  }
}
