import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { RichiestaMarker } from './agm-model/richiesta-marker.model';

@Component({
    selector: 'app-agm',
    templateUrl: './agm.component.html',
    styleUrls: ['./agm.component.css']
})
export class AgmComponent implements OnInit {
    @Input() richiesteMarkers: RichiestaMarker[];
    @Output() markerSelezionato = new EventEmitter();
    @Output() markerDeselezionato = new EventEmitter();

    /* proprietà iniziali per caricamento mappa */
    lat: number;
    lng: number;
    zoom: number;
    lastSelectedInfoWindow;

    icon = {
        url: '../../../assets/img/icone-markers/rosso.png',
        scaledSize: {
            width: 50,
            height: 50
        }
    };

    constructor() {
        this.lat = 41.890251;
        this.lng = 12.492373;
        this.zoom = 11;
    }

    ngOnInit() {
        /* console.log(this.richiesteMarkers); */
    }

    selezioneMarker(marker, infoWindow) {
        if (infoWindow === this.lastSelectedInfoWindow) {
            return;
        }
        if (this.lastSelectedInfoWindow != null) {
            try {
                this.lastSelectedInfoWindow.close();
            } catch { }
        }
        this.lastSelectedInfoWindow = infoWindow;
        this.markerSelezionato.emit(marker);
    }

    deselezioneMarker() {
        this.markerDeselezionato.emit();
    }
}
