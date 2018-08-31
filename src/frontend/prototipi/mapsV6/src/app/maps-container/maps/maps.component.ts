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

    /* proprietà iniziali per caricamento mappa */
    lat: number;
    lng: number;
    zoom: number;

    constructor() {
        this.lat = 41.890251;
        this.lng = 12.492373;
        this.zoom = 11;
    }

    ngOnInit() {
        /* console.log(this.richiesteMarkers); */
    }

    selezioneMarker(marker) {
        this.markerSelezionato.emit(marker);
    }
}
