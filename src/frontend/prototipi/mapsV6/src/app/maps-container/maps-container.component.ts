import { Component, OnInit } from '@angular/core';
import { RichiestaMarker } from './maps/maps-model/richiesta-marker.model';
import { MapsService } from './maps/maps-service/maps-service.service';

@Component({
  selector: 'app-maps-container',
  templateUrl: './maps-container.component.html',
  styleUrls: ['./maps-container.component.css']
})
export class MapsContainerComponent implements OnInit {
  richiesteMarkers: RichiestaMarker[];
  markersSelezionati: RichiestaMarker[] = [];
  constructor(private mapsService: MapsService) { }

  ngOnInit() {
    this.mapsService.getData().subscribe(r => {
      this.richiesteMarkers = r;
      console.log(this.richiesteMarkers);
    });
  }

  /* TESTING METHODS */
  setRandomMarker(newMarker) {
    this.richiesteMarkers.push(newMarker);
  }

  removeLastMarker() {
    this.richiesteMarkers.pop();
    // console.log(this.richiesteMarkers.length);
  }

  selezioneMarker(markerSelezionato) {
    this.markersSelezionati.push(markerSelezionato);
    console.log(markerSelezionato);
    console.log(this.markersSelezionati);
  }
}
