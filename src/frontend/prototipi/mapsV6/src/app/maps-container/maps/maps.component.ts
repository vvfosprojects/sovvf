import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { RichiestaMarker } from './maps-model/richiesta-marker.model';

@Component({
    selector: 'app-maps',
    templateUrl: './maps.component.html',
    styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {
    @Input() richiesteMarkers: RichiestaMarker[];
    @Output() markerSelezionato = new EventEmitter();
    @Output() markerDeselezionato = new EventEmitter();

    /* proprietà iniziali per caricamento mappa */
    lat: number;
    lng: number;
    zoom: number;

    lastSelectedInfoWindow;

    constructor() {
        this.lat = 41.890251;
        this.lng = 12.492373;
        this.zoom = 11;
    }

    ngOnInit() {
        /* console.log(this.richiesteMarkers); */
    }

    selezioneMarker(marker, infoWindow) {
        console.log(marker.id_richiesta);
        if (infoWindow === this.lastSelectedInfoWindow) {
            return;
        }
        if (this.lastSelectedInfoWindow != null) {
         try {
            this.lastSelectedInfoWindow.close();
          } catch {}
        }
        this.lastSelectedInfoWindow = infoWindow;
        this.markerSelezionato.emit(marker);
    }

    deselezioneMarker() {
        this.markerDeselezionato.emit();
    }
}
